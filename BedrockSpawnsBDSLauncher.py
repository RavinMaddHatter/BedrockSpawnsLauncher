from jwt import encode, decode
from requests import get,post
from json import loads,load,dumps,dump
from subprocess import PIPE, STDOUT, Popen
from queue import Queue
from threading import Thread
from os.path import exists
from os import makedirs
from boto3 import client, Session
from time import sleep
from argparse import ArgumentParser



class appLauncher:
    def __init__(self):
        self.apiURL="https://4sflrrfxa0.execute-api.us-east-2.amazonaws.com/default/bedrockSpawnsServerSetup"
        self.stdoutQueue=Queue()
        self.controlQueue=Queue()
        self.setup=False
        self.bdsRunning=False
        if exists("BedrockSpawnsBDSLauncherSettings.json"):
            with open("BedrockSpawnsBDSLauncherSettings.json") as settingsFile:
                self.settings=load(settingsFile)
        else:
            self.settings={}
            self.settings["rootToken"]=""
            self.settings["rootuser"]=""
            self.settings["users"]={}
            self.settings["bdsPath"]=""
            self.settings["bdsArgs"]=[]
            self.settings["QueueUrl"]=""
    def setBDSTarget(self,BDS,args=[]):
        self.settings["bdsPath"]=BDS

    def connect(self):
        cog = client('cognito-identity',"us-east-2")
        resp=cog.get_id(IdentityPoolId="us-east-2:aadf249a-bcd2-471d-b51d-4cdd4abf6599")
        resp = cog.get_credentials_for_identity(IdentityId=resp['IdentityId'])

        self.session=Session(
            aws_access_key_id=resp['Credentials']['AccessKeyId'],
            aws_secret_access_key=resp['Credentials']['SecretKey'],
            aws_session_token=resp['Credentials']['SessionToken']
        )
        self.sqs=self.session.client("sqs","us-east-2")
        self.sqsThread= Thread(target = self.checkQueue)
        self.sqsThread.start()
    def checkQueue(self):
        run=len(self.settings["QueueUrl"])>0
        
        while run:
            try:
                test=self.sqs.receive_message(QueueUrl=self.settings["QueueUrl"],
                         WaitTimeSeconds =20)
            except:
                print("session expired")
                cog = client('cognito-identity',"us-east-2")
                resp=cog.get_id(IdentityPoolId="us-east-2:aadf249a-bcd2-471d-b51d-4cdd4abf6599")
                resp = cog.get_credentials_for_identity(IdentityId=resp['IdentityId'])
                self.session=Session(
                        aws_access_key_id=resp['Credentials']['AccessKeyId'],
                        aws_secret_access_key=resp['Credentials']['SecretKey'],
                        aws_session_token=resp['Credentials']['SessionToken'])
                self.sqs=self.session.client("sqs","us-east-2")
                test=self.sqs.receive_message(QueueUrl=self.settings["QueueUrl"],
                         WaitTimeSeconds =20)
                
            try:
                for message in test["Messages"]:
                    body=loads(message["Body"])
                    response=post(self.apiURL,data=dumps({"msgId":message["ReceiptHandle"]}),
                                  headers={"opperation":"delete","authorizationtoken":self.settings["rootToken"]})
                    for cmd in body:
                        print(cmd)
                        if self.bdsRunning:
                            self.sendCommand(cmd)
                        else:
                            print("bds is not running, dumping commands")
                    print("done")
            except:
                print("20 seconds with no commands")

                pass
            if not self.controlQueue.empty():
                val=self.controlQueue.get()
                if val=="stop":
                    run=False
                else:
                    self.controlQueue.put(val)
    def setupFromToken(self,token):
        response=get(self.apiURL,headers={"authorizationtoken":token}).json()
        self.settings["rootToken"]=token
        
        if "QueueUrl" in response.keys():
            self.settings["QueueUrl"]=response["QueueUrl"]
            self.settings["rootuser"]=decode(token, options={"verify_signature": False})["user_id"]
        else:
            print(response)
    def delUser(self, userId):
        response=post(self.apiURL,
                      data=dumps({"user":userId}),
                      headers={"opperation":"deleteUser","authorizationtoken":self.settings["rootToken"]}).json()
        print(response)
    def listUsers(self):
        response=post(self.apiURL,
                      headers={"opperation":"listUsers","authorizationtoken":self.settings["rootToken"]}).json()
        users=response['users']
        print("users:")
        
        for user in users:
            print(user)
    def createUserToken(self,userId):
        response=post(self.apiURL,
                      data=dumps({"user":userId}),
                      headers={"opperation":"createUser","authorizationtoken":self.settings["rootToken"]}).json()
        response['token']
        return response
    def startServer(self):
        self.server=Popen(self.settings["bdsPath"],stdin=PIPE,stdout=PIPE,stderr=STDOUT,bufsize=1,universal_newlines=True)
        self.stdoutThread=Thread(target=self.serverOut,args=())
        self.stdoutThread.start()
        self.bdsRunning=True
    def serverOut(self):
        for line in iter(self.server.stdout.readline, b''):
            try:
                self.stdoutQueue.put(line)
                print('got line: {0}'.format(line), end='')
            except:
                pass
            if not self.controlQueue.empty():
                val=self.controlQueue.get()
                if val=="stopPrint":
                    print("stopping2")
                    break 
            
    def sendCommand(self, command):
        command=command
        
        self.server.stdin.writelines([command])
        self.server.stdin.flush()
        self.server.stdin.writelines(["\n"])
        self.server.stdin.flush()
        self.server.stdin.writelines(["\r"])
        self.server.stdin.flush()
    def stopServer(self):
        self.server.terminate()
        try:
            self.server.wait(timeout=0.2)
            self.bdsRunning=False
        except:
            print('subprocess did not terminate in time')
        self.stdoutThread.join()
    def save(self):
        with open("BedrockSpawnsBDSLauncherSettings.json","w+") as settingsFile:
                dump(self.settings,settingsFile,indent=4)
    def startShell(self):
        cmd=input("Enter Command: ")
        stop=False
        if cmd.lower() in ["h","help","-h"]:
            print("this is a psuedo shell for the bds server, to stop BDS cleanly send stop, otherwise non help commands are passed to BDS")
        elif cmd.lower() == "stop":
            try:
                self.sendCommand("stop")
            except:
                pass
            stop=True
            print("stoping")
        else:
            self.sendCommand(cmd)
        if stop:
            self.controlQueue.put("stopPrint")
            sleep(1)
            try:
                self.stopServer()
            except:
                pass
            self.controlQueue.put("stop")
        else:
            self.startShell()


if __name__ == "__main__":
    parser = ArgumentParser(description='Bedrock Spawns Server Launcher. A program designed to wrap BDS and allow the Bedrock spawns twitch extension to inject commands into your server.')
    parser.add_argument('-l', '--launch', action='store', default=False, help="Launch the server and all monitoring")
    parser.add_argument('-m', '--monitor', action='store', default=False, help="A method for monitoring and processing commands without BDS. This is nice for testing")

    parser.add_argument('-p', '--bdsPath', action='store', default="", help="Set the path for the BDS binary")
    parser.add_argument('-s', '--setupToken', action='store', default='', help="configure Bedrock Spawns Server using a setup token from bedrock spawns")
    parser.add_argument('-a', '--addUser', action='store', default='', help="add a user based upon the imput string")
    parser.add_argument('-d', '--delUser', action='store', default='', help="delete user based upon the imput string")
    parser.add_argument('-u', '--listUser', action='store', default=False, help="delete user based upon the imput string")

    args = parser.parse_args()
    server=appLauncher()
    if len(args.setupToken)>0:
        server.setupFromToken(args.setupToken)
        server.save()
    if len(args.addUser)>0:
        userToken=server.createUserToken(args.addUser)
        print("User TOken: {}".format(userToken))
        server.save()
    if len(args.delUser)>0:
        server.delUser(args.delUser)
        server.save()
    if args.listUser:
        server.listUsers()
    if len(args.bdsPath)>0:
        server.setBDSTarget(args.bdsPath)
        server.save()
    if args.monitor:
        server.connect()
        server.startShell()
    if args.launch:
        server.startServer()
        server.connect()
        server.startShell()

        
##test=appLauncher()
##test.setupFromToken("eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE5NDkzMjg1MzUsIm9wYXF1ZV91c2VyX2lkIjoiVVk0eXYxYzhPRHJCWmRieUVGNGVPIiwidXNlcl9pZCI6IjE0MTAzOTczNSIsImNoYW5uZWxfaWQiOiIxNDEwMzk3MzUiLCJyb2xlIjoiYnJvYWRjYXN0ZXIiLCJpc191bmxpbmtlZCI6ZmFsc2UsInB1YnN1Yl9wZXJtcyI6eyJsaXN0ZW4iOlsiYnJvYWRjYXN0Iiwid2hpc3Blci1VWTR5djFjOE9EckJaZGJ5RUY0ZU8iLCJnbG9iYWwiXSwic2VuZCI6WyJicm9hZGNhc3QiLCJ3aGlzcGVyLSoiXX19.r065o9wZAUvnIv3_ZvnDq-pGgRkn5CpEDlTpqu7WZ24")
##test.save()
##test.connect()
##test.startServer()
##print("sleeping")
#sleep(30)
#print("sending")
#test.sendCommand("say hi")
