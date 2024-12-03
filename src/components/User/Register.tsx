import React, { useState } from "react";
import {
  useForm,
  useFieldArray,
  SubmitHandler,
  FieldValues,
} from "react-hook-form";
import { useNavigate } from "react-router-dom";
import ServerApi from "../../serverApi/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";

// Define types for form data
interface Employee {
  name: string;
  email: string;
  hourlyWage: number;
}

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  venue: {
    name?: string;
    address?: string;
    phone?: string;
  };
  employees: Employee[];
}

const Register = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<RegisterFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "employees",
  });

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    try {
      const formattedData = {
        user: {
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          phone: data.phone,
          password: data.password,
        },
        venue: {
          name: data.venue?.name || "",
          address: data.venue?.address || "",
          phone: data.venue?.phone || "",
          employees: data.employees || [],
        },
      };

      const response = await ServerApi.post(
        "api/v1/auth/register",
        formattedData
      );
      console.log("Registration successful:", response.data);
      reset();
      navigate("/venues");
    } catch (error: any) {
      console.error("Error during registration:", error);
      setError(
        error?.response?.data?.msg ||
          "An error occurred during registration. Please try again."
      );
    }
  };

  const nextStep = () => setCurrentStep(currentStep + 1);
  const prevStep = () => setCurrentStep(currentStep - 1);

  const progressPercentage = (currentStep / 3) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6 w-full">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Register</CardTitle>
          <CardDescription>Create your account in 3 easy steps</CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progressPercentage} className="mb-6" />
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">User Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      {...register("firstName", {
                        required: "First name is required",
                      })}
                    />
                    {errors.firstName && (
                      <span className="text-red-600 text-sm">
                        {errors.firstName.message}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      {...register("lastName", {
                        required: "Last name is required",
                      })}
                    />
                    {errors.lastName && (
                      <span className="text-red-600 text-sm">
                        {errors.lastName.message}
                      </span>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value:
                          /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                        message: "Please enter a valid email",
                      },
                    })}
                  />
                  {errors.email && (
                    <span className="text-red-600 text-sm">
                      {errors.email.message}
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    {...register("phone", {
                      required: "Phone number is required",
                    })}
                  />
                  {errors.phone && (
                    <span className="text-red-600 text-sm">
                      {errors.phone.message}
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    {...register("password", {
                      required: "Password is required",
                      pattern: {
                        value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                        message:
                          "Password must contain at least one letter and one number",
                      },
                    })}
                  />
                  {errors.password && (
                    <span className="text-red-600 text-sm">
                      {errors.password.message}
                    </span>
                  )}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Business Details</h3>
                <div className="space-y-2">
                  <Label htmlFor="venueName">Business Name</Label>
                  <Input id="venueName" {...register("venue.name")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="venueAddress">Business Address</Label>
                  <Input id="venueAddress" {...register("venue.address")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="venuePhone">Business Phone</Label>
                  <Input id="venuePhone" {...register("venue.phone")} />
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Employee Details</h3>
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center space-x-2">
                    <Input
                      {...register(`employees.${index}.name`, {
                        required: "Name is required",
                      })}
                      placeholder="Employee Name"
                    />
                    <Input
                      {...register(`employees.${index}.email`, {
                        required: "Email is required",
                      })}
                      placeholder="Employee Email"
                    />
                    <Input
                      type="number"
                      {...register(`employees.${index}.hourlyWage`, {
                        required: "Hourly wage is required",
                      })}
                      placeholder="Hourly Wage"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => remove(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => append({ name: "", email: "", hourlyWage: 0 })}
                >
                  Add Employee
                </Button>
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          {currentStep > 1 && (
            <Button type="button" variant="outline" onClick={prevStep}>
              Back
            </Button>
          )}
          {currentStep < 3 ? (
            <Button type="button" onClick={nextStep}>
              Next
            </Button>
          ) : (
            <Button type="submit" onClick={handleSubmit(onSubmit)}>
              Submit
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
