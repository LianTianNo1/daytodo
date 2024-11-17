import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from '@tauri-apps/plugin-notification';
import { NotificationOptions } from '../types/notification';

export const useNotification = () => {
  // 检查并请求通知权限
  const requestNotificationPermission = async () => {
    try {
      let permissionGranted = await isPermissionGranted();

      if (!permissionGranted) {
        const permission = await requestPermission();
        permissionGranted = permission === 'granted';
      }

      return permissionGranted;
    } catch (error) {
      console.error('获取通知权限失败:', error);
      return false;
    }
  };

  // 发送通知
  const notify = async (config: NotificationOptions) => {
    try {
      const permissionGranted = await requestNotificationPermission();

      if (permissionGranted) {
        await sendNotification(config);
        return true;
      }

      console.warn('通知权限未授予');
      return false;
    } catch (error) {
      console.error('发送通知失败:', error);
      return false;
    }
  };

  // 发送任务到期提醒
  const notifyTaskDue = async (taskTitle: string) => {
    return notify({
      title: '任务到期提醒',
      body: `任务"${taskTitle}"即将到期，请注意处理！`,
      // icon: 'icon.png', // 确保在资源目录中有这个图标
      // sound: 'default', // 使用默认提示音
    });
  };

  // 发送任务完成提醒
  const notifyTaskComplete = async (taskTitle: string) => {
    return notify({
      title: '任务完成提醒',
      body: `恭喜！任务"${taskTitle}"已完成`,
      // icon: 'icon.png',
      // sound: 'default',
    });
  };

  return {
    notify,
    notifyTaskDue,
    notifyTaskComplete,
    requestNotificationPermission,
  };
};
