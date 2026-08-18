import { useId } from 'react';
import '../../styles/toggle-switch.css';

export default function ToggleSwitch({
	label,
	checked,
	onChange,
}: {
	label: string;
	checked: boolean;
	onChange: (checked: boolean) => void;
}) {
	const id = useId();

	return (
		<label className="toggle-switch" htmlFor={id}>
			<span className="toggle-switch__label">{label}</span>
			<input
				id={id}
				type="checkbox"
				checked={checked}
				onChange={(event) => onChange(event.target.checked)}
				aria-label={label}
			/>
			<span className="toggle-switch__track" aria-hidden="true" />
		</label>
	);
}
