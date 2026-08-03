/** Подписи ролей и действий для UI на русском */

export function roleLabel(role: string) {
  switch (role) {
    case "OWNER":
      return "Владелец";
    case "ADMIN":
      return "Админ";
    case "MEMBER":
      return "Участник";
    default:
      return role;
  }
}

export function actionLabel(action: string) {
  const map: Record<string, string> = {
    "tool.session_saved": "Сессия инструмента сохранена",
    "tool.session_cleared": "Сессия инструмента очищена",
    "tool.opened": "Инструмент открыт",
    "project.created": "Проект создан",
    "costs.synced": "Затраты обновлены",
    "member.invited": "Участник приглашён",
    "member.revoked": "Доступ отозван",
  };
  return map[action] || action;
}

export function spendKindLabel(kind: string) {
  switch (kind) {
    case "spend":
      return "списание";
    case "refund":
      return "возврат";
    case "grant":
      return "пополнение";
    case "deduct":
      return "списание";
    case "estimate":
      return "оценка";
    default:
      return kind;
  }
}
