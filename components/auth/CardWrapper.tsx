import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import React, { FunctionComponent, ReactNode } from "react";
import Header from "./Header";
import BackButton from "./BackButton";

type Props = {
  children: ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocials?: boolean;
};

const CardWrapper: FunctionComponent<Props> = (props) => {
  const { children, backButtonHref, backButtonLabel, headerLabel } = props;

  return (
    <Card className="w-[400px] shadow-md">
      <CardHeader>
        <Header label={headerLabel} />
      </CardHeader>

      <CardContent>{children}</CardContent>

      <CardFooter>
        <BackButton label={backButtonLabel} href={backButtonHref} />
      </CardFooter>
    </Card>
  );
};

export default CardWrapper;
