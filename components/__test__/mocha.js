import React from "react";
import Login, { validateEmail } from "../Login";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

describe("Test the Login Component with Dropdowns", () => {
  test("render the login form with two submit buttons and two dropdowns", async () => {
    render(<Login />);
    const buttonList = await screen.findAllByRole("button");
    const dropdown1 = screen.getByText("Dropdown 1");
    const dropdown2 = screen.getByText("Dropdown 2");

    expect(buttonList).toHaveLength(4);
    expect(dropdown1).toBeInTheDocument();
    expect(dropdown2).toBeInTheDocument();
  });

  test("should have dropdown options loaded", () => {
    render(<Login />);
    const dropdown1 = screen.getByText("Dropdown 1");
    const dropdown2 = screen.getByText("Dropdown 2");

    userEvent.click(dropdown1);
    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
    expect(screen.getByText("Option 3")).toBeInTheDocument();

    userEvent.click(dropdown2);
    expect(screen.getByText("Choice 1")).toBeInTheDocument();
    expect(screen.getByText("Choice 2")).toBeInTheDocument();
    expect(screen.getByText("Choice 3")).toBeInTheDocument();
  });

  test("should be failed on email validation ", () => {
    const testEmail = "dipesh.com";
    expect(validateEmail(testEmail)).not.toBe(true);
  });

  test("email input field should accept email", () => {
    render(<Login />);
    const emailInput = screen.getByPlaceholderText("Enter email");
    userEvent.type(emailInput, "dipesh");
    expect(emailInput.value).not.toMatch("dipesh.malvia@gmail.com");
  });

  test("password input should have type password", () => {
    render(<Login />);
    const passwordInput = screen.getByPlaceholderText("Password");
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  test("should display alert if email is invalid", () => {
    render(<Login />);
    const emailInput = screen.getByPlaceholderText("Enter email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const submitButton = screen.getByTestId("submit");

    userEvent.type(emailInput, "invalidemail");
    userEvent.type(passwordInput, "123456");
    userEvent.click(submitButton);

    const errorAlert = screen.getByText("Email is not valid");
    expect(errorAlert).toBeInTheDocument();
  });

  test("should be able to reset the form", () => {
    render(<Login />);
    const resetButton = screen.getByTestId("reset");
    const emailInput = screen.getByPlaceholderText("Enter email");
    const passwordInput = screen.getByPlaceholderText("Password");

    userEvent.type(emailInput, "test@example.com");
    userEvent.type(passwordInput, "password");
    userEvent.click(resetButton);

    expect(emailInput.value).toBe('');
    expect(passwordInput.value).toBe('');
  });

  // test("should be able to submit the form with valid email and password", () => {
  //   render(<Login />);
  //   const emailInput = screen.getByPlaceholderText("Enter email");
  //   const passwordInput = screen.getByPlaceholderText("Password");
  //   const submitButton = screen.getByTestId("submit");

  //   userEvent.type(emailInput, "validemail@example.com");
  //   userEvent.type(passwordInput, "123456");
  //   userEvent.click(submitButton);

  //   const userDisplay = screen.getByText("validemail@example.com");
  //   expect(userDisplay).toBeInTheDocument();
  // });
});



const isJson = (str) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

describe('JSON data validation for dropdowns', () => {
  test('dropdown 1 data is valid JSON', () => {
    const dropdown1Json = '[{"label": "Option 1"}, {"label": "Option 2"}, {"label": "Option 3"}]';
    expect(isJson(dropdown1Json)).toBe(true);
  });

  test('dropdown 2 data is valid JSON', () => {
    const dropdown2Json = '[{"label": "Choice 1"}, {"label": "Choice 2"}, {"label": "Choice 3"}]';
    expect(isJson(dropdown2Json)).toBe(true);
  });
});



describe('JSON Validity Tests', () => {
  test('Valid JSON string should return true', () => {
    const validJson = '{"name": "John", "age": 30}';
    expect(isJson(validJson)).toBe(true);
  });

  test('Invalid JSON string should return false', () => {
    const invalidJson = '{"name": "John", age: 30}';
    expect(isJson(invalidJson)).toBe(false);
  });

  test('Empty string should return false', () => {
    const emptyString = '';
    expect(isJson(emptyString)).toBe(false);
  });

  test('Non-JSON string should return false', () => {
    const nonJsonString = 'Just a regular string';
    expect(isJson(nonJsonString)).toBe(false);
  });


});


describe('Option in JSON Format Test', () => {
  const isOptionInJson = (jsonStr, optionLabel) => {
    try {
      const parsedArray = JSON.parse(jsonStr);
      return parsedArray.some(item => item.label === optionLabel);
    } catch (e) {
      console.error("Failed to parse JSON:", e);
      return false;
    }
  };

  test('Returns true if "Option 1" is in JSON format', () => {
    const jsonStr = '[{"label": "Option 1"}, {"label": "Option 2"}, {"label": "Option 3"}]';
    const result = isOptionInJson(jsonStr, "Option 1");
    expect(result).toBeTruthy();
  });

  test('Returns false if JSON is invalid', () => {
    const invalidJsonStr = 'invalid JSON';
    const result = isOptionInJson(invalidJsonStr, "Option 1");
    expect(result).toBeFalsy();
  });

  test('Returns false if "Option 1" is not present in JSON', () => {
    const jsonStrWithoutOption1 = '[{"label": "Option 2"}, {"label": "Option 3"}]';
    const result = isOptionInJson(jsonStrWithoutOption1, "Option 1");
    expect(result).toBeFalsy();
  });
});
