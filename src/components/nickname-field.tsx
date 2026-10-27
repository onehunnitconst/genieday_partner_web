import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { NICKNAME_MAX_LENGTH } from "@/utils/nickname";

type NicknameFieldProps = {
  id: string;
  value: string;
  error: string | null;
  disabled?: boolean;
  autoFocus?: boolean;
  /** 오류가 없을 때 입력란 아래에 보여줄 안내 */
  description?: string;
  onChange: (value: string) => void;
};

export function NicknameField({
  id,
  value,
  error,
  disabled,
  autoFocus,
  description = "한글, 영문, 숫자로 2~12자까지 쓸 수 있어요.",
  onChange,
}: NicknameFieldProps) {
  return (
    <Field data-invalid={error ? true : undefined}>
      <FieldLabel htmlFor={id}>닉네임</FieldLabel>
      <Input
        id={id}
        value={value}
        maxLength={NICKNAME_MAX_LENGTH}
        autoComplete="nickname"
        autoFocus={autoFocus}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        placeholder="한글, 영문, 숫자 2~12자"
        onChange={(event) => onChange(event.target.value)}
      />
      {error ? (
        <FieldError>{error}</FieldError>
      ) : (
        <FieldDescription>{description}</FieldDescription>
      )}
    </Field>
  );
}
