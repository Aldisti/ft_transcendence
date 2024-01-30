# API Documentation

---

## API Index

- ### Authentication
  - [Login](#login)
  - [Logout](#logout)
  - [Logout all]()
  - [Refresh token](#refresh-token)

- ### OAuth2
  - [Status]()
  - **Intra**
    - [Url](#intra-get-url)
    - [Redirect](#intra-redirect)
    - [Login](#intra-login)
    - [Link](#intra-link)
    - [Unlink]()
  - **Google**
    - [Url]()
    - [Login]()
    - [Link]()
    - [Unlink]()

- ### 2-Factor-Auth
  - [Status](#status)
  - [Activate](#activate)
  - [Disable](#disable)
  - [Validate login](#validate-login)
  - [Validate activate](#validate-activate)
  - [Validate recover](#validate-recover)

---

## Authentication

### Login
Endpoint: **/auth/login/**  
Request type: **POST**  
Permission required: **None**  
Throttle rate: **6/minute**
Json params: **username**, **password**  
Return values: **access_token**  
Return codes: **200**, **400**, **500**  
Cookie set: **refresh_token**  

### Logout
Endpoint: **/auth/logout/**  
Request type: **GET**  
Permission required: **User**  
Throttle rate: **6/minute**  
Return codes: **200**, **401**, **403**, **500**  
Cookie unset: **refresh_token**

### Refresh token
Endpoint: **/auth/refresh/**  
Request type: **GET**  
Permission required:  
Throttle rate: **6/minute**
Return values: **access_token**  
Return codes: **200**, **400**, **403**, **500**  



## Oauth2

### Intra get url
Endpoint: **/oauth2/intra/url/**  
Request type: **GET**  
Throttle rate: **60/minute**  
Query params: **type**  
Return values: **url**  
Return codes: **200**, **400**, **500**  
Cookie set: **state_token**  

### Intra redirect
Endpoint: **/oauth2/intra/callback/<link/login>**  
Request type: **GET**  
Throttle rate: **30/minute**  
Url params: **req_type**  
Query params: **code**, **state**  
Return codes: **200**, **403**, **500**  
Cookie set: **api_token**  
Cookie unset: **state_token**

### Intra login
Endpoint: **/oauth2/intra/login/**  
Request type: **POST**  
Permission required:  
Throttle rate: **6/minute**  
Return values: **access_token**  
Return codes: **200**, **400**, **404**, **500**  
Cookie set: **refresh_token**  
Cookie unset: **api_token**

### Intra link
Endpoint: **/oauth2/intra/link/**  
Request type: **POST**  
Permission required: **User**  
Throttle rate: **6/minute**  
Return codes: **200**, **400**, **500**  
Cookie unset: **api_token**



## 2-Factor-Auth

### Status
Endpoint: **/2fa/manage/**  
Request type: **GET**  
Permission required: **User**  
Return codes: **200**, **500**  

### Activate
Endpoint: **/2fa/manage/**  
Request type: **POST**  
Permission required: **User**  
Json params: **type**  
Return values:  **uri**, **token**  
Return codes: **200**, **400**, **500**  

### Disable
Endpoint: **/2fa/manage/**  
Request type: **DELETE**  
Permission required: **User**  
Json params: **code**  
Return codes: **200**, **400**, **500**  

### Validate login
Endpoint: **/2fa/validate/login/**  
Request type: **GET**  
Throttle rate: **10/minute**  
Json params: **code**, **token**  
Return values: **access_token**  
Return codes: **200**, **400**, **500**  
Cookie set: **refresh_token**  

### Validate activate
Endpoint: **/2fa/validate/activate/**  
Request type: **GET**  
Permission required: **User**  
Throttle rate: **30/minute**  
Json params: **code**  
Return values: **codes**  
Return codes: **200**, **400**, **500**  

### Validate recover
Endpoint: **/2fa/validate/recover/**  
Request type: **GET**  
Throttle rate: **10/minute**  
Json params: **code**, **token**  
Return values: **token**  
Return codes: **200**, **400**, **500**  



---

## Definitions

Endpoint
: the full endpoint to the API

Request type
: the request type, like GET, POST, DELETE, etc.
 
Permission required
: authentication level needed to access the API, like User, Moderator or Admin  

Throttle rate
: how many request per second/minute/hour can handle the API

Url params
: the possible url parameters like /api/v1/<parameter>/

Query params
: the possible query parameters like /api/v1/?<parameter>=<value>

Json params
: the json fields in a request body to the API

Return values
: the json fields in the response body made by the API

Return codes
: the all possible status code returned by the API

Cookie set
: the cookies set by the API

Cookie unset
: the cookies unset by the API

---
