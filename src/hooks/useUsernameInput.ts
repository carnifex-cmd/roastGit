"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const usernamePattern = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/;

export function useUsernameInput() {
    const router = useRouter();
    const [value, setValue] = useState("");
    const [touched, setTouched] = useState(false);

    const trimmed = value.trim();
    const isValid = useMemo(() => usernamePattern.test(trimmed), [trimmed]);
    const showError = touched && trimmed.length > 0 && !isValid;

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!isValid) return;
        router.push(`/roast/${trimmed}`);
    }

    return {
        value,
        setValue,
        touched,
        setTouched,
        trimmed,
        isValid,
        showError,
        handleSubmit
    };
}
