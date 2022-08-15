import requests
import json
import jwt
import queue
import threading
import asyncio
import sys
import json
import uuid
import time
import websockets
from websockets import serve
with open("variables.json") as file:
    data=json.load(file)
secret = data["key"];
serverName = data["severName"];
nickName = data["nickName"];
owner = data["owner"];
completedRedeems=[]
commandQueue={}
startTime=time.time()
url="https://4sflrrfxa0.execute-api.us-east-2.amazonaws.com/default/bedrockSpawnsServerSetup"
controlqueue=queue.Queue()
messagequeue=queue.Queue()
class WsClient:
    def start(self, host="0.0.0.0", port=19132):
        self.ws = websockets.serve(self.receive, host, port)
        self.host = host
        self.port = port
        self.loop = asyncio.get_event_loop()
        self.loop.run_until_complete(self.ws)
        self.event_ready()
        self.loop.run_forever()

    async def receive(self, websocket, path):
        self.ws = websocket
        await self.listen_event()
        await self.event("connect")  # self.event_connect()
        try:
            while controlqueue.empty():
                if not messagequeue.empty():
                    await self.command(messagequeue.get())
                
                            
        except (
                websockets.exceptions.ConnectionClosedOK,
                websockets.exceptions.ConnectionClosedError,
                websockets.exceptions.ConnectionClosed):
            await self.event("disconnect")  # self.event_disconnect()
            sys.exit()

    async def listen_event(self):
        for event in self.events:
            await self.ws.send(json.dumps({
                "body": {
                    "eventName": event
                },
                "header": {
                    "requestId": "00000000-0000-0000-0000-000000000000",
                    "messagePurpose": "subscribe",
                    "version": 1,
                    "messageType": "commandRequest"
                }
            }))

    async def parse_command(self, message):
        if message["header"]["messagePurpose"] == "event":
            event_name = message["header"]["eventName"]
            await self.event(event_name, message)
        elif message["header"]["messagePurpose"] == "error":
            await self.event("error", message)

    async def command(self, cmd):
        uuid4 = str(uuid.uuid4())
        cmd_json = json.dumps({
            "body": {
                "origin": {
                    "type": "player"
                },
                "commandLine": cmd,
                "version": 1
            },
            "header": {
                "requestId": uuid4,
                "messagePurpose": "commandRequest",
                "version": 1,
                "messageType": "commandRequest"
            }
        })
        await self.ws.send(cmd_json)
        data = await self.ws.recv()
        msg = json.loads(data)
        if msg["header"]["messagePurpose"] == "commandResponse" and msg["header"]["requestId"] == uuid4:
            return msg
        else:
            return None

    async def event(self, name, *args):
        func = f"self.event_{name}"
        if args == ():
            try:
                await eval(f"{func}()")
            except NameError as e:
                print(f"event_{name}")
        else:
            try:
                await eval(f"{func}({args})")
            except NameError as e:
                print(f"event_{name}")


class MyWsClient(WsClient):
    def event_ready(self):
        print(f"Ready {self.host}:{self.port}")

        self.events = ["*","PlayerMessage", "PlayerDied","ItemDropped"]
    async def event_connect(self):
        print("Connected!")
        await self.command("say Connected to Bedrock Spawns locally")
    
    async def event_disconnect(self):
        print("disconnect!")

    async def event_PlayerMessage(self, event):
        pass
#        print(event)

    async def event_PlayerDied(self, event):
        #print(event)
        pass

def watchThread():
    completedRedeems=[]
    while startTime+36000>time.time():
        time.sleep(1)
        payload={}
        payload["exp"]=time.time()+60
        payload["serverName"]=serverName
        payload["completed"]=completedRedeems
        token = "Bearer " + jwt.encode(payload, secret, algorithm="HS256");
        headers = {"authorizationtoken": token}
        r=requests.get(url, headers=headers)
        data=json.loads(r.content)
        commandTimestamps=list(data["redeems"].keys())
        commandTimestamps.sort()
        for timestamp in commandTimestamps:
            if timestamp not in completedRedeems:
                completedRedeems.append(timestamp)
                print(data["redeems"][timestamp])
                for cmd in data["redeems"][timestamp]:
                    messagequeue.put(cmd)
                    #await self.command(cmd)
    completedRedeems=list(set(completedRedeems)-set(data["completed"])) 
threading.Thread(target=watchThread, daemon=True).start()

MyWsClient().start(host="localhost",port=1234)            
