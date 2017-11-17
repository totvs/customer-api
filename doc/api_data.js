define({ "api": [
  {
    "version": "0.1.0",
    "type": "delete",
    "url": "customer/:id",
    "title": "Delete softly a customer",
    "group": "Customer",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "id",
            "optional": false,
            "field": "id",
            "description": "<p>customer id</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 204 No Content",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Delete error",
          "content": "HTTP/1.1 500 Internal Server Error",
          "type": "json"
        }
      ]
    },
    "filename": "routes/customer.router.js",
    "groupTitle": "Customer",
    "name": "DeleteCustomerId"
  },
  {
    "version": "0.1.0",
    "type": "delete",
    "url": "customer/remove/:id",
    "title": "Remove a customer",
    "group": "Customer",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "id",
            "optional": false,
            "field": "id",
            "description": "<p>customer id</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 204 No Content",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Delete error",
          "content": "HTTP/1.1 500 Internal Server Error",
          "type": "json"
        }
      ]
    },
    "filename": "routes/customer.router.js",
    "groupTitle": "Customer",
    "name": "DeleteCustomerRemoveId"
  },
  {
    "version": "0.1.0",
    "type": "get",
    "url": "customer/",
    "title": "Find all customers",
    "group": "Customer",
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 OK\n{\n  \"id\": 1,\n  \"name\": \"Nelson\",\n  \"address\": \"Rua Emilio Castelar, 51\",\n  \"dateOfbirth\": \"06/13/1989\",\n  \"createdAt\": \"Fri Nov 10 2017 18:24:08 GMT-0200 (-02)\",\n  \"updatedAt\": \"Fri Nov 12 2017 13:35:49 GMT-0200 (-02)\",\n  \"deleted\": false\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Find error",
          "content": "HTTP/1.1 500 Internal Server Error",
          "type": "json"
        }
      ]
    },
    "filename": "routes/customer.router.js",
    "groupTitle": "Customer",
    "name": "GetCustomer"
  },
  {
    "version": "0.1.0",
    "type": "get",
    "url": "customer/diff/:date",
    "title": "Find the customers modified after a date",
    "group": "Customer",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "date",
            "optional": false,
            "field": "date",
            "description": "<p>a date reference</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 OK\n{\n  \"id\": 1,\n  \"name\": \"Nelson\",\n  \"address\": \"Rua Emilio Castelar, 51\",\n  \"dateOfbirth\": \"06/13/1989\",\n  \"createdAt\": \"Fri Nov 10 2017 18:24:08 GMT-0200 (-02)\",\n  \"updatedAt\": \"Fri Nov 12 2017 13:35:49 GMT-0200 (-02)\",\n  \"deleted\": false\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "customer not found",
          "content": "HTTP/1.1 404 Not Found",
          "type": "json"
        },
        {
          "title": "Find error",
          "content": "HTTP/1.1 500 Internal Server Error",
          "type": "json"
        }
      ]
    },
    "filename": "routes/customer.router.js",
    "groupTitle": "Customer",
    "name": "GetCustomerDiffDate"
  },
  {
    "version": "0.1.0",
    "type": "post",
    "url": "customer/",
    "title": "Register a new customer",
    "group": "Customer",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>customer id</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>customer name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "address",
            "description": "<p>customer address</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "dateOfbirth",
            "description": "<p>customer dateOfbirth</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Input",
          "content": "{\n  \"name\": \"Study\",\n  \"address\": \"Rua Emilio Castelar, 51\",\n  \"dateOfbirth\": \"06/13/1989\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 OK\n{\n  \"id\": as4s4f5wh548h9,\n  \"name\": \"Study\",\n  \"address\": \"Rua Emilio Castelar, 51\",\n  \"dateOfbirth\": \"06/13/1989\",\n  \"createdAt\": Fri Nov 10 2017 18:24:08 GMT-0200 (-02),\n  \"deleted\": false\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Register error",
          "content": "HTTP/1.1 500 Internal Server Error",
          "type": "json"
        }
      ]
    },
    "filename": "routes/customer.router.js",
    "groupTitle": "Customer",
    "name": "PostCustomer"
  },
  {
    "version": "0.1.0",
    "type": "put",
    "url": "customer/",
    "title": "Edit a customer",
    "group": "Customer",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>customer id</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>customer name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "address",
            "description": "<p>customer address</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "dateOfbirth",
            "description": "<p>customer dateOfbirth</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Input",
          "content": "{\n  \"name\": \"Nelson\",\n  \"address\": \"Rua Emilio Castelar, 51\",\n  \"dateOfbirth\": \"06/13/1989\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 OK\n{\n  \"id\": as4s4f5wh548h9,\n  \"name\": \"Nelson\",\n  \"address\": \"Rua Emilio Castelar, 51\",\n  \"dateOfbirth\": \"06/13/1989\",\n  \"createdAt\": Fri Nov 10 2017 18:24:08 GMT-0200 (-02),\n  \"updatedAt\": Fri Nov 12 2017 13:35:49 GMT-0200 (-02),\n  \"deleted\": false\n}",
          "type": "json"
        },
        {
          "title": "Success",
          "content": "HTTP/1.1 204 No Content",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Register error",
          "content": "HTTP/1.1 500 Internal Server Error",
          "type": "json"
        }
      ]
    },
    "filename": "routes/customer.router.js",
    "groupTitle": "Customer",
    "name": "PutCustomer"
  }
] });
