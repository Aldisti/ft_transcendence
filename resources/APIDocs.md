# API Documentation

---

### API Endpoints Index

- *Authentication*
  - [Login](#login)
  - [Logout](#logout)
  - [Refresh token](#refresh-token)

- *OAuth2*
  - [Intra get url](#intra-get-url)
  - [Intra redirect](#intra-redirect)
  - [Intra login](#intra-login)
  - [Intra link](#intra-link)

- *2FA*
  - [Status](#status)
  - [Activate](#activate)
  - [Disable](#disable)
  - [Validate login](#validate-login)
  - [Validate activate](#validate-activate)
  - [Validate recover](#validate-recover)

---

## Authentication endpoints

### Login
Endpoint: **/auth/login/**  
Request type: **POST**  
Permission required: **None**  
Throttle rate: **6/minute**  
Url params:  
Query params:  
Json params: **username**, **password**  
Return values: **access_token**  
Return codes: **200**, **400**, **500**  
Cookie set: **refresh_token**  
Cookie unset:

### Logout
Endpoint: **/auth/logout/**  
Request type: **GET**  
Permission required: **User**  
Throttle rate: **6/minute**  
Url params:  
Query params:  
Json params:  
Return values:  
Return codes: **200**, **401**, **403**, **500**  
Cookie set:  
Cookie unset: **refresh_token**

### Refresh token
Endpoint: **/auth/refresh/**  
Request type: **GET**  
Permission required:  
Throttle rate: **6/minute**
Url params:  
Query params:  
Json params:  
Return values: **access_token**  
Return codes: **200**, **400**, **403**, **500**  
Cookie set:  
Cookie unset:

## Oauth2 endpoints

### Intra get url
Endpoint: **/oauth2/intra/url/**  
Request type: **GET**  
Permission required:  
Throttle rate: **60/minute**  
Url params:  
Query params: **type**  
Json params:  
Return values: **url**  
Return codes: **200**, **400**, **500**  
Cookie set: **state_token**  
Cookie unset:

### Intra redirect
Endpoint: **/oauth2/intra/callback/<link/login>**  
Request type: **GET**  
Permission required:  
Throttle rate: **30/minute**  
Url params: **req_type**  
Query params: **code**, **state**  
Json params:  
Return values:  
Return codes: **200**, **403**, **500**  
Cookie set: **api_token**  
Cookie unset: **state_token**

### Intra login
Endpoint: **/oauth2/intra/login/**  
Request type: **POST**  
Permission required:  
Throttle rate: **6/minute**  
Url params:  
Query params:  
Json params:  
Return values: **access_token**  
Return codes: **200**, **400**, **404**, **500**  
Cookie set: **refresh_token**  
Cookie unset: **api_token**

### Intra link
Endpoint: **/oauth2/intra/link/**  
Request type: **POST**  
Permission required: **User**  
Throttle rate: **6/minute**  
Url params:  
Query params:  
Json params:  
Return values:  
Return codes: **200**, **400**, **500**  
Cookie set:  
Cookie unset: **api_token**

## 2-Factor Auth endpoints

### Status
Endpoint: **/2fa/manage/**  
Request type: **GET**  
Permission required: **User**  
Throttle rate:  
Url params:  
Query params:  
Json params:  
Return values:  
Return codes: **200**, **500**  
Cookie set:  
Cookie unset:

### Activate
Endpoint: **/2fa/manage/**  
Request type: **POST**  
Permission required: **User**  
Throttle rate:  
Url params:  
Query params:  
Json params: **type**  
Return values:  **uri**, **token**  
Return codes: **200**, **400**, **500**  
Cookie set:  
Cookie unset:

### Disable
Endpoint: **/2fa/manage/**  
Request type: **DELETE**  
Permission required: **User**  
Throttle rate:  
Url params:  
Query params:  
Json params: **code**  
Return values:  
Return codes: **200**, **400**, **500**  
Cookie set:  
Cookie unset:

### Validate login
Endpoint: **/2fa/validate/login/**  
Request type: **GET**  
Permission required:  
Throttle rate: **10/minute**  
Url params:  
Query params:  
Json params: **code**, **token**  
Return values: **access_token**  
Return codes: **200**, **400**, **500**  
Cookie set: **refresh_token**  
Cookie unset:  

### Validate activate
Endpoint: **/2fa/validate/activate/**  
Request type: **GET**  
Permission required: **User**  
Throttle rate: **30/minute**  
Url params:  
Query params:  
Json params: **code**  
Return values: **codes**  
Return codes: **200**, **400**, **500**  
Cookie set:  
Cookie unset:

### Validate recover
Endpoint: **/2fa/validate/recover/**  
Request type: **GET**  
Permission required:  
Throttle rate: **10/minute**  
Url params:  
Query params:  
Json params: **code**, **token**  
Return values: **token**  
Return codes: **200**, **400**, **500**  
Cookie set:  
Cookie unset:
