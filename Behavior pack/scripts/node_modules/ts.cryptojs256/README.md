# CryptoJS - 256 [![Titanium](http://www-static.appcelerator.com/badges/titanium-git-badge-sq.png)](http://www.appcelerator.com/titanium/) [![Alloy](http://www-static.appcelerator.com/badges/alloy-git-badge-sq.png)](http://www.appcelerator.com/alloy/) [![License](http://img.shields.io/badge/license-Apache%202.0-blue.svg?style=flat)](http://choosealicense.com/licenses/apache-2.0/)

This module for the [Appcelerator](http://www.appcelerator.com) Titanium Alloy MVC framework brings
CryptoJS 256 methods into Titanium.

## Quick Start

### Get it [![gitTio](http://gitt.io/badge.png)](http://gitt.io/component/ts.cryptojs256) 

**Download this repository and install it**

* In your application's `tiapp.xml` file, add the module to the modules section: 

```xml
<modules>
    <module platform="commonjs">ts.cryptojs256</module>
</modules>
```

* Copy the `ts.cryptojs256-commonjs-x.x.x.zip` bundle into your root app directory.

**Or use your favorite package manager** 

- [gitTio](http://gitt.io/cli): `gittio install ts.cryptojs256`

### Use it

```javascript
var CryptoJS = require('ts.cryptojs256');

var encodedString = CryptoJS.enc.base64.stringify("The Smiths");
var hmacHash = CryptoJS.HmacSHA256("The Smiths", "Secret Key");

// Please refer to the original documentation of CryptoJS for more information and examples.

```

### API

##### CryptoJS.enc.Base64

> *A Base64 encoder object*

##### CryptoJS.enc.Base64.stringify(str) :: {String}

> *Encode a string using Base64 encoder*
>  
> - `{String}` **str** The given string to encode
> - **return** `{String}` The encoded string

##### CryptoJS.enc.Base64.parse(str) :: {String}

> *Decode an Base64 encoded string*
>  
> - `{String}` **str** The given string to decode
> - **return** `{String}` The decoded string

##### CryptoJS.enc.Utf8

> *A Utf8 encoder object*

##### CryptoJS.enc.Utf8.stringify(str) :: {String}

> *Encode a string using Utf8 encoder*
>  
> - `{String}` **str** The given string to encode
> - **return** `{String}` The encoded string

##### CryptoJS.enc.Utf8.parse(str) :: {String}

> *Decode an Utf8 encoded string*
>  
> - `{String}` **str** The given string to decode
> - **return** `{String}` The decoded string

##### CryptoJS.enc.Latin1
> *A Latin1 encoder object*

##### CryptoJS.enc.Latin1.stringify(str) :: {String}

> *Encode a string using Latin1 encoder*
>  
> - `{String}` **str** The given string to encode
> - **return** `{String}` The encoded string

##### CryptoJS.enc.Latin1.parse(str) :: {String}

> *Decode an Latin1 encoded string*
>  
> - `{String}` **str** The given string to decode
> - **return** `{String}` The decoded string

##### CryptoJS.SHA256(str) :: {String}

> *Crypt a string using a SHA256 algorithm*
>  
> - `{String}` **str** The given string to crypt
> - **return** `{String}` The crypted string

##### CryptoJS.HmacSHA256(str, secretKey) :: {String}

> *Crypt a string using a Hmac256 algorithm and a secret key*
>  
> - `{String}` **str** The given string to crypt
> - `{String}` **secretKey** The secret key used for encryption
> - **return** `{String}` The crypted string

## Changelog
* 1.0 First version

[![wearesmiths](http://wearesmiths.com/media/logoGitHub.png)](http://wearesmiths.com)

Appcelerator, Appcelerator Titanium and associated marks and logos are trademarks of Appcelerator, Inc.  
Titanium is Copyright (c) 2008-2015 by Appcelerator, Inc. All Rights Reserved.  
Titanium is licensed under the Apache Public License (Version 2).  
