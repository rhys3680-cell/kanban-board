export const authErrorMessages: Record<string, string> = {
  // 인증 관련 에러
  "invalid_credentials": "이메일 또는 비밀번호가 올바르지 않습니다.",
  "Invalid login credentials": "이메일 또는 비밀번호가 올바르지 않습니다.",
  "Email not confirmed": "이메일 인증이 완료되지 않았습니다. 이메일을 확인해주세요.",
  "User already registered": "이미 가입된 이메일입니다.",
  "Signup requires a valid password": "유효한 비밀번호를 입력해주세요.",

  // 비밀번호 관련 에러
  "Password should be at least 6 characters": "비밀번호는 최소 6자 이상이어야 합니다.",
  "Password is too weak": "비밀번호가 너무 약합니다.",

  // 이메일 관련 에러
  "Unable to validate email address: invalid format": "올바른 이메일 형식이 아닙니다.",
  "Invalid email": "올바른 이메일 형식이 아닙니다.",

  // 네트워크 및 기타 에러
  "Failed to fetch": "네트워크 연결을 확인해주세요.",
  "Network request failed": "네트워크 연결을 확인해주세요.",
};

interface SupabaseError extends Error {
  code?: string;
}

export function getAuthErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    // Supabase error 객체 처리
    const supabaseError = error as SupabaseError;

    // code 필드가 있는 경우
    if (supabaseError.code && authErrorMessages[supabaseError.code]) {
      return authErrorMessages[supabaseError.code];
    }

    // message 필드로 매칭
    if (error.message && authErrorMessages[error.message]) {
      return authErrorMessages[error.message];
    }

    // message에 키워드가 포함되어 있는 경우
    for (const [key, value] of Object.entries(authErrorMessages)) {
      if (error.message.includes(key)) {
        return value;
      }
    }

    return error.message;
  }

  return "오류가 발생했습니다.";
}
