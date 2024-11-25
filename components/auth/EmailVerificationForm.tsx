"use client";

import FormError from "@/components/form-error";
import FormSuccess from "@/components/form-success";
import { useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useMemo } from "react";
import { BeatLoader } from "react-spinners";
import CardWrapper from "./CardWrapper";
import { verifyTokenAction } from "@/actions/verification";

const EmailVerificationForm = () => {
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams.get("token"), [searchParams]);

  const [error, setError] = React.useState<string>();
  const [success, setSuccess] = React.useState<string>();

  const handleVerification = useCallback(async () => {
    if (!token) {
      setError("Missing token!");
      return;
    }

    try {
      const result = await verifyTokenAction(token);

      if (result?.status === 400) {
        setError(result.message);
      } else {
        setSuccess(result.message);
      }
    } catch (err) {
      console.log(err);
      setError("Something went wrong!");
    }
  }, [token]);

  useEffect(() => {
    handleVerification().then();
  }, [handleVerification]);

  return (
    <CardWrapper
      headerLabel="Confirming your verification."
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <div className="flex items-center w-full justify-center">
        {!success && !error && <BeatLoader color="#36d7b7" />}

        <FormSuccess message={success} />
        <FormError message={error} />
      </div>
    </CardWrapper>
  );
};

export default EmailVerificationForm;
