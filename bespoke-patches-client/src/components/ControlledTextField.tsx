import { ITextFieldProps, TextField } from "@fluentui/react";
import React from "react";
import { Controller, ControllerProps } from "react-hook-form";
import { useTranslation } from "react-i18next";

const ControlledTextField: React.FC<
  Omit<ControllerProps & ITextFieldProps, "render"> & {
    msgVars?: Record<string, string>;
  }
> = ({ name, control, rules, defaultValue, msgVars, ...props }) => {
  const { t } = useTranslation();
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      defaultValue={defaultValue || ""}
      render={({
        field: { onChange, onBlur, name: fieldName, value },
        fieldState: { error },
      }) => (
        <TextField
          {...props}
          onChange={onChange}
          value={value}
          onBlur={onBlur}
          name={fieldName}
          errorMessage={
            error
              ? t(
                  `Form.${error.type === "validate" ? name : error.type}`,
                  msgVars
                )
              : ""
          }
          defaultValue={undefined}
        />
      )}
    />
  );
};

export default ControlledTextField;
