# Homework API

## `/homework`

### `PUT`: create homework

The request requires a `homework` object, if not given it will return a `notValidRequest` error.
Inside that `group` object, there needs to be a `name` string and a `groupId` id/string.
The `title` string must be under 200 characters (isn't yet checked in the server; it's a TODO)
The `description` string must be under 5000 characters (isn't yet checked in the server; it's a TODO)

| Name | Required? | Type | Notes |
| :--- | :-------- | :--- | :---- |
| `title` | Yes | String | This specifies the name of the homework, it has a length limit of 200 characters. |
| `description` | No (defaults to none) | String | This specifies the description of the homework, it has a length limit of 5000 characters. |
| `groupId` | Yes | String | This specifies the id of where to put the homework in. Note that you must be admin on that group to add homeworks. |

| Error name | What it means |
| :--------- | :------------ |
| `invalidRequest` | Your request is not valid, as in "your request code is broken". It probably means you don't have a `homework` object or your `homework` object doesn't have a `groupId`. |
| `noTitle` | There isn't a `title` property on your `homework` object or it is empty. |
| `tooLongTitle` | The `title` value is over 200 characters. |
| `tooLongDescription` | The `description` value is over 5000 characters. |
| `groupDoesntExist` | There's no group matching that `groupId`. |
| `forbidden` | You don't have permission to add homeworks on that group. |

```json
{
	"homework": {
		"groupId": "5a766b2f7598570eb978fc11",
		"title": "do ur math kidz!"
	}
}
```

```json
{
  "success": true,
  "homework": {
    "__v": 0,
    "createdBy": "5a7523a973223b41ef7c4ee1",
    "groupId": "5a766b2f7598570eb978fc11",
    "title": "do ur math kidz!",
    "_id": "5a95c715c0d44c62054f9e8a",
    "createdAt": "2018-02-27T21:01:09.850Z"
  }
}
```

## `/homeworks`

### `GET`

Returns all homeworks of the user.

## `/homework/done`

### `PATCH`

| Name | Required? | Type | Notes |
| :--- | :-------- | :--- | :---- |
| `homeworkId` | Yes | String | This specifies the id of the homework to set as 'done'. |

| Error name | What it means |
| :--------- | :------------ |
| `invalidRequest` | Your request is not valid, as in "your request code is broken". It probably means you don't have a `homeworkId`. |
| `homeworkDoesntExist` | You know what it means |

## `/homework/notDone`

### `PATCH`

| Name | Required? | Type | Notes |
| :--- | :-------- | :--- | :---- |
| `homeworkId` | Yes | String | This specifies the id of the homework to unset as 'done'. |

| Error name | What it means |
| :--------- | :------------ |
| `invalidRequest` | Your request is not valid, as in "your request code is broken". It probably means you don't have a `homeworkId`. |
| `homeworkDoesntExist` | You know what it means |
