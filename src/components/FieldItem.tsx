import { Form, FormItemProps } from "@arco-design/web-react";
import React, { cloneElement, ReactElement } from "react";
import {
  Field,
  FieldProps,
  FieldRenderProps,
  RenderableProps,
} from "react-final-form";

export default function FieldItem({
  formItemProps,
  fieldProps,
  children,
  render,
}: {
  formItemProps?: FormItemProps;
  fieldProps: FieldProps<any, FieldRenderProps<any>>;
  children?: ReactElement;
  render?: RenderableProps<FieldRenderProps<any, HTMLElement, any>>["render"];
}) {
  return (
    <Field
      validateFields={[]}
      validate={(val) => {
        if (formItemProps?.required && !val) {
          return "The field cannot be blank";
        }
      }}
      render={({ input, meta }) => {
        return (
          <Form.Item
            validateStatus={
              meta.validating
                ? "validating"
                : meta.touched && meta.error
                ? "error"
                : undefined
            }
            help={meta.touched && meta.error}
            {...formItemProps}
          >
            {render
              ? render({ input, meta })
              : children &&
                cloneElement(children, {
                  ...input,
                  error: meta.touched && meta.error,
                  value: input.value || undefined,
                  onChange(...args: any[]) {
                    children.props.onChange?.(...args);
                    input.onChange(args[0]);
                  },
                })}
          </Form.Item>
        );
      }}
      {...fieldProps}
    ></Field>
  );
}
