import { appSettings } from 'shared/lib/appSettings';
import { generateRandomId } from 'shared/lib/utils';
import { get, writable } from 'svelte/store';
import { Electron } from './electron';

const NOTIFICATION_TIMEOUT_DEFAULT = 5000;
export const NOTIFICATION_TIMEOUT_NEVER = -1;

export type NotificationData = {
    type: 'info' | 'warning' | 'error'
    message: string
    progress?: number
    subMessage?: string
    actions?: {
        label: string
        isPrimary?: boolean;
        callback?: (notificationData: NotificationData, actionIndex: number) => void
    }[],
    id?: string
    ts?: number
    timeout?: number
    contextData?: any
}

export const displayNotifications = writable<Array<NotificationData>>([]);

export function showSystemNotification(notificationData: NotificationData): string {
    return showNotification(notificationData, true)
}

export function showAppNotification(notificationData: NotificationData): string {
    return showNotification(notificationData, false)
}

export function showNotification(notificationData: NotificationData, showSystemNotification: boolean): string {
    notificationData.id = generateRandomId()
    notificationData.ts = Date.now();
    notificationData.actions = notificationData.actions ?? [];
    notificationData.timeout = notificationData.timeout ?? NOTIFICATION_TIMEOUT_DEFAULT;
    if (notificationData.progress !== undefined) {
        notificationData.progress = Math.min(Math.max(notificationData.progress, 0), 100);
    }

    if (showSystemNotification &&
        get(appSettings).notifications &&
        Electron.NotificationManager) {
        Electron.NotificationManager.notify(notificationData.message, notificationData.contextData)
    } else {
        for (const action of notificationData.actions) {
            if (!action.callback) {
                action.callback = (notificationData, _) => removeDisplayNotification(notificationData.id)
            }
        }

        displayNotifications.update((_currentNotifications) => {
            _currentNotifications.push(notificationData)
            return _currentNotifications
        })
    }

    if (notificationData.timeout !== NOTIFICATION_TIMEOUT_NEVER) {
        setTimeout(() => removeDisplayNotification(notificationData.id), notificationData.timeout);
    }

    return notificationData.id;
}

export function removeDisplayNotification(id: string): void {
    displayNotifications.update((_currentNotifications) => {
        const idx = _currentNotifications.findIndex(n => n.id === id)
        if (idx >= 0) {
            _currentNotifications.splice(idx, 1)
        }
        return _currentNotifications
    })
}

export function updateDisplayNotificationProgress(id: string, progress: number): void {
    displayNotifications.update((_currentNotifications) => {
        const notification = _currentNotifications.find(n => n.id === id)
        if (notification) {
            notification.progress = Math.min(Math.max(progress, 0), 100)
        }
        return _currentNotifications
    })
}

export function updateDisplayNotification(id: string, updateData: NotificationData): void {
    displayNotifications.update((_currentNotifications) => {
        const notification = _currentNotifications.find(n => n.id === id)
        if (notification) {
            notification.message = updateData.message;
            notification.subMessage = updateData.subMessage;
            notification.progress = updateData.progress;
            notification.actions = updateData.actions;
            notification.timeout = updateData.timeout ?? NOTIFICATION_TIMEOUT_DEFAULT;

            if (notification.timeout !== NOTIFICATION_TIMEOUT_NEVER) {
                setTimeout(() => removeDisplayNotification(notification.id), notification.timeout);
            }
        }
        return _currentNotifications
    })
}
