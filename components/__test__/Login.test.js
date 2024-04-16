import React from "react";
import Login, { validateEmail } from "../Login";
import { render, screen , fireEvent,waitFor,within} from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import '@testing-library/jest-dom/extend-expect';


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

  test("should have dropdown options loaded", async () => {
    render(<Login />);
    const dropdown1Toggle = screen.getByText("Dropdown 1"); // Ensure this matches the text or aria-label of the dropdown
    const dropdown2Toggle = screen.getByText("Dropdown 2"); // Ensure this matches as well
  
    // Interact with Dropdown 1 to display options
    userEvent.click(dropdown1Toggle);
    await waitFor(() => {
      expect(screen.getByText("Option 1")).toBeInTheDocument();
      expect(screen.getByText("Option 2")).toBeInTheDocument();
      expect(screen.getByText("Option 3")).toBeInTheDocument();
    });
  
    // Select an option from Dropdown 1 to enable Dropdown 2
    userEvent.click(screen.getByText("Option 1")); // Assuming selecting this option enables Dropdown 2
  
    // Ensure Dropdown 2 is enabled and then interact with it
    await waitFor(() => {
      expect(dropdown2Toggle).not.toBeDisabled();
    });
  
    userEvent.click(dropdown2Toggle);
    
    // Now check if the options in Dropdown 2 are loaded
    await waitFor(() => {
      expect(screen.getByText("Choice 1")).toBeInTheDocument();
      expect(screen.getByText("Choice 2")).toBeInTheDocument();
      expect(screen.getByText("Choice 3")).toBeInTheDocument();
    });
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



describe('Dropdown interactions', () => {
  test('Dropdown 2 should have options loaded upon selection in Dropdown 1', async () => {
    render(<Login />);

    // Ensure the first dropdown toggle is clicked to show options
    const dropdown1Toggle = await screen.findByTestId('dropdown1-toggle');
    fireEvent.click(dropdown1Toggle);
    const option1 = await screen.findByText('Option 1');
    fireEvent.click(option1); // Select an option

    // Ensure Dropdown 2 is enabled
    await waitFor(() => {
      const dropdown2Toggle = screen.getByTestId('dropdown2-toggle');
      expect(dropdown2Toggle).not.toBeDisabled();
    });

    // Click to open Dropdown 2 and check for options
    fireEvent.click(screen.getByTestId('dropdown2-toggle'));
    await waitFor(() => {
      expect(screen.getByText('Choice 1')).toBeInTheDocument();
    });
  });
});

describe('Dropdown interactions1', () => {
  test('Dropdown 2 should have options loaded upon selection in Dropdown 1', async () => {
    render(<Login />);

    // Locate the toggles for both dropdowns
    const dropdown1Toggle = screen.getByTestId('dropdown1-toggle');
    const dropdown2Toggle = screen.getByTestId('dropdown2-toggle');

    // Open the first dropdown to reveal its options
    userEvent.click(dropdown1Toggle);
    const optionsDropdown1 = await screen.findAllByRole('button', { name: /^Option/ });

    // Select the first option from the first dropdown (assuming it enables Dropdown 2)
    userEvent.click(optionsDropdown1[0]);

    // Ensure Dropdown 2 is enabled
    await screen.findByRole('button', { name: 'Dropdown 2' });  // This ensures it has been updated and is accessible

    // Open the second dropdown and verify options
    userEvent.click(dropdown2Toggle);
    const optionsDropdown2 = await screen.findAllByRole('button', { name: /^Choice/ });

    // Check that options are now available in the second dropdown
    expect(optionsDropdown2.length).toBeGreaterThan(0); // Check if at least one option is available
    expect(optionsDropdown2[0]).toHaveTextContent('Choice 1'); // Check specific content if necessary
  });
});

describe('Generic Dropdown Interaction Tests', () => {
  test('Interacting with Dropdown 1 enables and loads Dropdown 2', async () => {
    render(<Login />);

    // Get the dropdown toggle buttons by their test IDs
    const dropdown1Toggle = screen.getByTestId('dropdown1-toggle');
    const dropdown2Toggle = screen.getByTestId('dropdown2-toggle');

    // Interact with the first dropdown
    userEvent.click(dropdown1Toggle);

    // Assuming we don't know the exact option names, we fetch all clickable items in the dropdown
    const dropdown1Menu = within(screen.getByLabelText('Dropdown 1')).getAllByRole('button');
    expect(dropdown1Menu.length).toBeGreaterThan(0); // Ensure there are options to interact with

    // Click the first option in Dropdown 1
    userEvent.click(dropdown1Menu[0]);  // This should trigger any state changes linked to Dropdown 1 interactions

    // Check if Dropdown 2 is enabled after interaction with Dropdown 1
    expect(dropdown2Toggle).toBeEnabled(); // Verify Dropdown 2 is now enabled

    // Open Dropdown 2 to view its options
    userEvent.click(dropdown2Toggle);

    // Fetch all clickable items in the now opened Dropdown 2
    const dropdown2Menu = within(screen.getByLabelText('Dropdown 2')).getAllByRole('button');
    expect(dropdown2Menu.length).toBeGreaterThan(0); // Ensure Dropdown 2 is populated

    // Optionally, interact with an option in Dropdown 2 if necessary for further actions
  });
});
