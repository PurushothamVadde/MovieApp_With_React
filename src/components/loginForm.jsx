import React, { Component } from "react";
import Form from "./common/form";
import Joi from "joi-browser";
import auth from "./../services/authService";
import { Redirect } from "react-router-dom";

class LoginForm extends Form {
  state = {
    data: { username: "", password: "" },
    errors: {},
  };
  schema = {
    username: Joi.string().required().label("Username"),
    password: Joi.string().required().label("Password"),
  };

  doSubmit = async () => {
    try {
      const data = this.state.data;
      const { state } = this.props.location;
      await auth.login(data.username, data.password);
      window.location = state ? state.from.pathname : "/";
    } catch (exception) {
      if (exception.response && exception.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.username = exception.response.data;
        this.setState({ errors });
      }
    }
  };

  render() {
    if (auth.getCurrentUser()) return <Redirect to="/" />;
    return (
      <div>
        <form onSubmit={this.handleSubmit} className="container m-8">
          <h1>LoginForm</h1>
          {this.renderInput("username", "UserName")}
          {this.renderInput("password", "Password", "password")}
          {this.renderButton("Login")}
        </form>
      </div>
    );
  }
}

export default LoginForm;
