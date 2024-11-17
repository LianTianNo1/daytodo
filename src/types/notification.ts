/**
 * 通知可见性枚举
 */
export enum NotificationVisibility {
  /** 在所有屏幕上显示完整通知 */
  PUBLIC = 'public',
  /** 在安全屏幕上隐藏敏感内容 */
  PRIVATE = 'private',
  /** 在安全屏幕上完全隐藏通知 */
  SECRET = 'secret'
}

/**
 * 通知附件类型
 */
export interface NotificationAttachment {
  /** 附件标识符 */
  id: string;
  /** 附件URL */
  url: string;
  /** 附件类型 */
  type?: string;
}

/**
 * 通知调度配置
 */
export interface NotificationSchedule {
  /** 在指定时间触发 */
  at?: Date;
  /** 重复间隔(毫秒) */
  repeating?: boolean;
  /** 每周重复的星期几(0-6) */
  weekday?: number;
  /** 是否允许在空闲时发送 */
  allowWhileIdle?: boolean;
}

/**
 * 通知配置选项
 */
export interface NotificationOptions {
  /** 通知唯一标识(32位整数) */
  id?: number;

  /** 通知渠道ID */
  channelId?: string;

  /** 通知标题(必填) */
  title: string;

  /** 通知内容 */
  body?: string;

  /** 定时发送配置 */
  schedule?: NotificationSchedule;

  /** 大段文本内容(与inboxLines互斥) */
  largeBody?: string;

  /** 通知摘要(用于大段文本或群组通知) */
  summary?: string;

  /** 通知动作类型 */
  actionTypeId?: string;

  /** 通知分组标识符 */
  group?: string;

  /** 是否作为群组摘要(Android) */
  groupSummary?: boolean;

  /** 提示音名称(移动端) */
  sound?: string;

  /** 收件箱样式的文本行(最多5行,与largeBody互斥) */
  inboxLines?: string[];

  /** 通知图标(Android需放在res/drawable目录) */
  icon?: string;

  /** 大图标(Android,需放在res/drawable目录) */
  largeIcon?: string;

  /** 图标颜色(Android) */
  iconColor?: string;

  /** 附件列表 */
  attachments?: NotificationAttachment[];

  /** 额外数据 */
  extra?: Record<string, unknown>;

  /** 是否为持续通知(Android) */
  ongoing?: boolean;

  /** 点击时是否自动取消 */
  autoCancel?: boolean;

  /** 是否静默通知(iOS无角标无声音不显示) */
  silent?: boolean;

  /** 通知可见性 */
  visibility?: NotificationVisibility;

  /** 通知代表的项目数量(Android) */
  number?: number;
}
