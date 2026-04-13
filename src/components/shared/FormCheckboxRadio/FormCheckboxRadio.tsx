import React, {
  FormEvent, ReactElement,
} from 'react';

import './FormCheckboxRadio.scss';

type Props = {
  type?: string;
  label?: string;
  name?: string;
  id?: string;
  value?: boolean;
  disabled?: boolean;
  onChange?: (e: boolean) => void;
  className?: string;
}

const FormCheckboxRadio = ({
  type,
  label,
  name,
  id,
  value,
  disabled,
  onChange,
  className,
}: Props): ReactElement => {
  const labelComp = label && <span className="FormCheckboxRadio-label">{label}</span>;
  const finalClassName = `FormCheckboxRadio ${type} ${className}`;
  const handleChange = (event: FormEvent<HTMLInputElement>): void => {
    if (onChange) onChange(event.currentTarget.checked);
  };
  return (
    <label className={finalClassName} htmlFor={id}>
      {labelComp}
      <input className="FormCheckboxRadio-input" type={type} name={name} id={id} checked={value} onChange={handleChange} disabled={disabled} />
      <span className="FormCheckboxRadio-mark" />
    </label>
  );
};
FormCheckboxRadio.defaultProps = {
  type: 'checkbox',
  className: '',
  name: undefined,
  id: undefined,
  label: undefined,
  onChange: undefined,
  value: undefined,
  disabled: false,
};
export default FormCheckboxRadio;
