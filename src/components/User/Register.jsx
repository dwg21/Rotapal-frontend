import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "employees",
  });
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      // Send data to the server
      const response = await ServerApi.post("/api/v1/register", data);
      console.log("Registration successful:", response.data);
      reset(); // Reset the form after successful submission
      navigate("/welcome");
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  const nextStep = () => setCurrentStep(currentStep + 1);
  const prevStep = () => setCurrentStep(currentStep - 1);
  const skipStep = () => nextStep();

  const progressPercentage = (currentStep / 3) * 100;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div
          className="bg-blue-600 h-2 rounded-full"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {currentStep === 1 && (
          <div>
            <h3 className="text-xl font-semibold mb-2">User Details</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                {...register("firstName", {
                  required: "First name is required",
                })}
                type="text"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              />
              {errors.firstName && (
                <span className="text-red-600">{errors.firstName.message}</span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                {...register("lastName", { required: "Last name is required" })}
                type="text"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              />
              {errors.lastName && (
                <span className="text-red-600">{errors.lastName.message}</span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                    message: "Please enter a valid email",
                  },
                })}
                type="email"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              />
              {errors.email && (
                <span className="text-red-600">{errors.email.message}</span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                {...register("phone", { required: "Phone number is required" })}
                type="text"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              />
              {errors.phone && (
                <span className="text-red-600">{errors.phone.message}</span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                {...register("password", {
                  required: "Password is required",
                  pattern: {
                    value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                    message:
                      "Password must contain at least one letter and one number",
                  },
                })}
                type="password"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              />
              {errors.password && (
                <span className="text-red-600">{errors.password.message}</span>
              )}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <h3 className="text-xl font-semibold mb-2">Venue Details</h3>
            <p className="text-sm text-gray-500 mb-4">
              You can skip this section and add venue details later.
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                {...register("venue.name")}
                type="text"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                {...register("venue.address")}
                type="text"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                {...register("venue.phone")}
                type="text"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Opening Hours
              </label>
              <div className="space-y-2">
                {[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ].map((day) => (
                  <div key={day} className="flex items-center space-x-2">
                    <span className="w-20">{day}</span>
                    <input
                      {...register(
                        `venue.openingHours.${day.toLowerCase()}.open`
                      )}
                      type="time"
                      className="p-2 border border-gray-300 rounded-md"
                    />
                    <input
                      {...register(
                        `venue.openingHours.${day.toLowerCase()}.close`
                      )}
                      type="time"
                      className="p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <h3 className="text-xl font-semibold mb-2">Employee Details</h3>
            <p className="text-sm text-gray-500 mb-4">
              You can skip this section and add employee details later.
            </p>
            <div className="space-y-2">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center space-x-2">
                  <input
                    {...register(`employees.${index}.name`)}
                    type="text"
                    className="p-2 border border-gray-300 rounded-md"
                    placeholder="Employee Name"
                  />
                  <input
                    {...register(`employees.${index}.email`)}
                    type="text"
                    className="p-2 border border-gray-300 rounded-md"
                    placeholder="Employee Email"
                  />
                  <input
                    {...register(`employees.${index}.hourlyWage`)}
                    type="number"
                    className="p-2 border border-gray-300 rounded-md"
                    placeholder="Hourly Wage"
                  />
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <div className="flex items-center space-x-2">
                <input
                  {...register("newEmployee.name")}
                  type="text"
                  className="p-2 border border-gray-300 rounded-md"
                  placeholder="Employee Name"
                />
                <input
                  {...register("newEmployee.email")}
                  type="text"
                  className="p-2 border border-gray-300 rounded-md"
                  placeholder="Employee Email"
                />
                <input
                  {...register("newEmployee.hourlyWage")}
                  type="number"
                  className="p-2 border border-gray-300 rounded-md"
                  placeholder="Hourly Wage"
                />
                <button
                  type="button"
                  onClick={() => append({ name: "", email: "", hourlyWage: 0 })}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-4">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="py-2 px-4 bg-gray-200 rounded-md"
            >
              Back
            </button>
          )}
          {currentStep < 3 ? (
            <>
              <button
                type="button"
                onClick={skipStep}
                className="py-2 px-4 bg-gray-200 rounded-md"
              >
                Skip
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Next
              </button>
            </>
          ) : (
            <button
              type="submit"
              className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Submit
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Register;
