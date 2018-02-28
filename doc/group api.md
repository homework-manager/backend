# Group API

## `/group`

### `POST`: create group

The request requires a `group` object, if not given it will return a `notValidRequest` error.
Inside that `group` object, there needs to be a `name` string and a `joinName` string.
The `joinName` string must be alphanumerical and don't contain spaces (isn't yet checked in the server; it's a TODO)

| Name | Required? | Type | Notes |
| :--- | :-------- | :--- | :---- |
| `name` | Yes | String | This specifies the name of the group, it has a length limit of 100 characters. |
| `joinName` | Yes | String | This specifies the join name, required to join the group. It must be alphanumerical, don't contain spaces and has a length limit of 50 characters. |
| `private` | No (defaults to true) | Boolean | This specifies the privacy policy of the group. If true, you must have permission from an admin to join. If false, everyone can join it.

| Error name | What it means |
| :--------- | :------------ |
| `invalidRequest` | Your request is not valid, as in "your request code is broken". It probably means you don't have a `group` object. |
| `noName` | There isn't a `name` property on your `group` object or it is empty. |
| `noJoinName` | There isn't a `joinName` property on your `group` object or it is empty. |
| `tooLongName` | The `name` value is over 100 characters. |
| `tooLongJoinName` | The `joinName` value is over 50 characters. |
| `joinNameAlreadyUsed` | There's already another group with that `joinName`. |

Example:

```json
{
	"group": {
		"name": "Example group",
		"joinName": "examplegroup"
	}
}
```

The response would be something like:

```json
{
  "success": true,
  "group": {
    "__v": 0,
    "private": true,
    "joinName": "examplegroup",
    "name": "Example group",
    "_id": "5a766e9908237d107358ffdc",
    "members": [
      {
        "roles": {
          "admin": true
        },
        "id": "5a7523a973223b41ef7c4ee1"
      }
    ]
  }
}
```

An example error response:

```json
{
  "success": false,
  "error": {
    "joinNameAlreadyUsed": true,
		"message": "There's already a group with that join name."
  }
}
```

## `/group/join`

### `POST`

The request requires a `joinName` property.

| Name | Required? | Type | Notes |
| :--- | :-------- | :--- | :---- |
| `joinName` | Yes | String | The join name of the group to join. |

| Error name | What it means |
| :--------- | :------------ |
| `noJoinName` | There isn't a `joinName` property or it's empty |
| `groupDoesntExist` | There isn't a group with that `joinName`. |
| `private` | The group requested to join to is private, you need permission from an admin of that group. |

Example:

```json
{
  "joinName": "examplegroup"
}
```

The response would be something like:

```json
{
  "success": true,
  "group": {
    "_id": "5a7675ae1167981785a23b33",
    "private": false,
    "joinName": "examplegroup",
    "name": "Example group",
    "__v": 0,
    "members": [
      {
        "id": "5a7523a973223b41ef7c4ee1",
        "roles": {
          "admin": true
        }
      }
    ]
  }
}
```

An example error response:

```json
{
  "success": false,
  "error": {
    "noJoinName": true,
		"message": "You didn't specify any join name."
  }
}
```

## `/groups`

### `GET`

Example:

```json
{
  "success": true,
  "groups": [
		{
	    "_id": "5a7675ae1167981785a23b33",
	    "private": false,
	    "joinName": "examplegroup",
	    "name": "Example group",
	    "__v": 0,
	    "members": [
	      {
	        "id": "5a7523a973223b41ef7c4ee1",
	        "roles": {
	          "admin": true
	        }
	      }
	    ]
	  }
	]
}
```
