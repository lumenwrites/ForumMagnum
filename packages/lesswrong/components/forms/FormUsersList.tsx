import React from 'react';
import { registerComponent, useStyles } from '../../lib/vulcan-lib/components';
import { useFormComponentContext, formCommonStyles, LWForm } from './formUtil';

const styles = (theme: ThemeType): JssStyles => ({
  ...formCommonStyles(theme),
});

export function FormUsersList<T, FN extends keyof T>({form, fieldName, label}: {
  form: LWForm<T>,
  fieldName: NameOfFieldWithType<T,FN,string[]>,
  label: string,
}) {
  const classes = useStyles(styles, "FormUsersList");
  const {value,setValue} = useFormComponentContext<string[],T>(form, fieldName);
  return <div className={classes.formField}>
    {label}
    { /*TODO*/ }
  </div>
}

registerComponent('FormUsersList', FormUsersList, {styles});
declare global {
  interface ComponentTypes {
    FormUsersList: typeof FormUsersList
  }
}