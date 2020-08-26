import React, { Component } from "react";
import Joi, { errors } from "joi-browser";
import Form from "./common/form";
import auth from "../services/authService";
import { register } from "../services/userService";

class Registration extends Form {
  state = {
    data: {
      username: "",
      password: "",
      customerName: "",
    },
    errors: {},
  };
  schema = {
    username: Joi.string().required().email().label("Username"),
    password: Joi.string().required().min(6).label("Password"),
    customerName: Joi.string().required().label("CustomerName"),
  };
  doSubmit = async () => {
    try {
      const response = await register(this.state.data);
      auth.loginWithJwt(response.headers["x-auth-token"]);
      window.location = "/";
      console.log(response);
    } catch (exception) {
      if (exception.response && exception.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.username = exception.response.data;
        this.setState({ errors });
      }
    }
  };

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit} className="container m-8">
          <h1>Registration Form</h1>
          {this.renderInput("username", "UserName")}
          {this.renderInput("password", "Password", "password")}
          {this.renderInput("customerName", "CustomerName")}
          {this.renderButton("Register")}
        </form>
      </div>
    );
  }
}

export default Registration;
