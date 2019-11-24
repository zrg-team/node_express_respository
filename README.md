# About

Project for building RESTful APIs and microservices using Node.js, Express and Mariadb
We focus on:
 + Easy to start
 + Reduce copied code
 + Easy to debug and find problems
 + Readable code
 + Simple to implement new api for a model like: search, create, update
 + etc

## Features

+ [CORS](https://www.npmjs.com/package/cors) enabled
+ Uses [YARN](https://yarnpkg.com/lang/en/)
+ Express + Mariadb
+ Uses [Sequelize](https://sequelize.org/) as ORM
+ [Standardjs](https://standardjs.com/) as coding style
+ [Docker](https://www.docker.com/) support
+ Uses helmet to set some HTTP headers for security
+ Load environment variables from configs file
+ Request validation with [Joi](https://github.com/hapijs/joi)
+ Logging with [winston](https://github.com/winstonjs/winston)
+ Authentication and Authorization with [JWT](https://jwt.io/)
+ Support repositories
+ Default search feature
+ Upload file using [multer](https://github.com/expressjs/multer)
+ Email
+ Support generate model and seed, migration

## Requirements

+ [Nodejs](https://nodejs.org/en/)
+ [Docker]((https://www.docker.com/))
+ [Yarn](https://yarnpkg.com/lang/en/) or [npm](https://www.npmjs.com/)

## Structure motivation

#### 1. We separate routes into many files based on main model. ex:

  user.js

    - POST / => /user/
    - POST /login => /user/login
    - POST /verify => /user/verify
    - GET /  => /user/
    - GET /version => /user/version

    ...
  
  Each route includes there middlewares: 

```javascript
'GET /': {
  path: 'UserController.find',
  middlewares: [
    auth.service.all(),
    file.image.none()
  ]
},
```

That mean the GET api will handle by UserController function find. it will go throught authentication's middleware (in that case support all role) and file's middleware (in that case don't support file upload).

#### 2. We uses sequelize at database ORM and model's layer

```javascript
module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define('user', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_name: {
      type: DataTypes.STRING(128),
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: '1'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    user_type_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    avatar: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    avatar_file_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'user'
  })
  User.associate = (factory) => {
    factory.User.belongsTo(factory.UserType, {
      as: 'userTypeOfUser',
      foreignKey: 'user_type_id',
      sourceKey: 'id'
    })

    factory.User.associationModels = {
      userTypeOfUser: factory.UserType
    }
  }

  return User
}

```

Also support auto generate models by command

```
npm run generate_models // currently, generated model do not support associate
```



#### 3. Repositories is used to abstract the data layer, making our application more flexible to maintain.

Methods:

- create
- update
- findById
- findOne
- get
- paginate
- count
- pushCriteria

Create repository by extend base Repository class

```javascript
const Repository = require('./Repository')

class UserRepository extends Repository {
  constructor () {
    super('user')

    this.STATUS = {
      DELETE: 0,
      NEW: 1,
      APPROVED: 2,
      BANNED: 3
    }
    this.DEFAULT_LIMIT = 20
    this.DEFAULT_SORT = [['id', 'DESC']]
    this.DEFAULT_PAGE = 0
  }
}

module.exports = new UserRepository()

```

or custom everything

```javascript
const Repository = require('./Repository')
const factory = require('../utils/repositoryHelper')

class RoleRepository extends Repository {
  constructor () {
    super()
    this.model = factory.getRepositoryModel('file')

    this.STATUS = {
      DELETE: 0,
      NEW: 1,
      APPROVED: 2,
      BANNED: 3
    }
    this.DEFAULT_LIMIT = 20
    this.DEFAULT_SORT = [['id', 'DESC']]
    this.DEFAULT_PAGE = 0
  }

  async bulkCreate (inputs, option = {}) {
    return this.model.bulkCreate(inputs, option)
  }

  async create (input, option = {}) {
    // TODO Extended validator
    return this.model.create({
      ...input
    }, option)
  }

  update (input, query = {}) {
    return this.model
      .update(
        { ...input },
        query
      )
  }

  destroy (options) {
    return this.model.destroy(options)
  }

  findById (uid) {
    return this.model.findByPk(uid)
  }

  findOne (query) {
    return this.model.findOne({
      ...query
    })
  }

  mapGetFilters (filters) {
    return { ...filters }
  }

  get (filters, criteria) {
    filters = this.prepareGetFilters({
      ...criteria,
      ...filters
    })

    return this.model.findAll(filters)
      .then(result => {
        return this.handleResult(result)
      })
  }

  paginate (filters, criteria) {
    filters = this.prepareGetFilters({
      ...criteria,
      ...filters
    })

    return this.model.findAndCountAll(filters)
      .then(result => {
        return this.handlePaginate(result, filters)
      })
  }

  count (filters, criteria) {
    filters = this.prepareGetFilters({
      ...filters,
      ...criteria
    }, true)
    return this.model.count(filters)
      .then(result => {
        return result
      })
  }
}
module.exports = new RoleRepository()

```

#### 4. Controllers handles requests using repository layer 

```javascript
const response = require('../utils/response')
const userRepository = require('../repositories/UserRepository')
const DefaultCriteria = require('../criterias/DefaultCriteria')
const SensitiveCriteria = require('../criterias/SensitiveCriteria')

const defaultCriteria = new DefaultCriteria()
const sensitiveCriteria = new SensitiveCriteria()
const Controller = () => {
  const version = (req, res) => {
    return response(res)
      .success({ msg: '1.0.0' })
  }

  const find = async (req, res, next) => {
    try {
      const users = await userRepository
        .pushCriteria(defaultCriteria, sensitiveCriteria)
        .apply(req)
        .paginate({})

      return response(res).success({ ...users })
    } catch (err) {
      return next(err)
    }
  }

  return {
    version,
    find
  }
}

module.exports = Controller

```

#### 5. Criteria: Default criteria supported fast search on a repository, push criteria to your request using below code

```javascript
const users = await userRepository
  .pushCriteria(defaultCriteria, sensitiveCriteria)
  .apply(req)
  .paginate({})
```

userRepository now can support a lot of search conditions.



http://api.local/users?search=name:John%20Doe

or 

http://api.local/users?search=name:John&searchFields=name:like

or

http://api.local/users?search=email:john@gmail.com;name=john&searchFields=email:=;name:like

By default DefaultCriteria makes its queries using the AND comparison operator for each query parameter.

http://api.local/users?search=email:john@gmail.com;age=18&searchFields=email:=;age:>=

The above example will execute the following query:

```
SELECT * FROM users WHERE age >= 18 AND email = 'john@gmail.com';
```

In order for it to query using the OR, pass the searchJoin parameter as shown below:

http://api.local/users?search=email:john@gmail.com;age=18&searchFields=email:=;age:>=&searchJoin=or

Filtering fields

http://api.local/users?fields=id;name

Sorting the results

http://api.local/users?order=name:desc

Add relationship

http://api.local/users?includes=userTypeOfUser

result will be: 

```
  [
    {
      id: 1,
      name: 'hello',
      userTypeOfUser: {
        id: 2,
        name: 'ADMIN'
      }
    }
  ]
```

Search with relationship

http://api.local/users?search=userTypeOfUser.name:USER&includes=userTypeOfUser

result:

```
  []
```

or with option

http://api.local/users?search=userTypeOfUser.name:ADMIN&includes=userTypeOfUser&includeNotRequired=false

result:

```
  {
    id: 1,
    name: 'hello',
    userTypeOfUser: null
  }
```

#### 6.Domain logic should put to services folders
