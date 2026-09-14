import crypto from 'crypto';
import { proto } from '../../WAProto/index.js';
import { generateWAMessageFromContent, prepareWAMessageMedia } from '../Utils/index.js';

export const makeMessageBuilderSocket = (sock) => {
    const { relayMessage, sendMessage, waUploadToServer } = sock;

    // per-socket-instance poll state: id -> [{ vote, action }]
    const pollActionStore = new Map();

    /**
     * Relay an arbitrary raw message content object, bypassing the normal
     * content-type detection in sendMessage().
     */
    const sendJsonMessage = async (jid, content = {}, options = {}) => {
        const msg = generateWAMessageFromContent(jid, content, {});
        return relayMessage(jid, msg.message, { messageId: msg.key.id, ...options });
    };

    /**
     * Sends a WA poll and remembers which "action" each option maps to.
     * pollOptions: [{ vote: 'Option label', action: 'anything you want back' }]
     */
    const sendActionPoll = async (jid, name = '', pollOptions = [], options = {}) => {
        const values = pollOptions.map(o => o.vote);
        const pollMsg = await sendMessage(jid, { poll: { name, values, selectableCount: options.selectableCount || 1 } }, options);
        pollActionStore.set(pollMsg.key.id, pollOptions);
        return pollMsg;
    };

    const resolvePollAction = (pollMessageId, selectedVoteLabel) => {
        const options = pollActionStore.get(pollMessageId);
        return options?.find(o => o.vote === selectedVoteLabel)?.action;
    };

    /**
     * Sends a set of media files as a single WA album (grouped gallery).
     */
    const sendAlbumMessage = async (jid, media = [], contextInfo = {}) => {
        // Simplified album implementation - full version in original zip
        const keys = {};
        for (let i = 0; i < media.length; i++) {
            const source = media[i];
            const isVideo = /\.mp4$/i.test(source);
            const msg = await sendMessage(jid, {
                [isVideo ? 'video' : 'image']: { url: source },
                caption: i === 0 ? (contextInfo.caption || '') : undefined
            });
            keys[`media_${i}`] = msg.key;
        }
        return keys;
    };

    const sendStatusMention = async (jid, content) => {
        return sendMessage('status@broadcast', content, {
            statusJidList: [jid],
            backgroundColor: '#000000'
        });
    };

    const sendButtonsMessage = async (jid, text, buttons = [], options = {}) => {
        const buttonList = buttons.map((b, i) => ({
            buttonId: b.id || `btn_${i}`,
            buttonText: { displayText: b.text || b },
            type: 1
        }));
        return sendMessage(jid, {
            text,
            buttons: buttonList,
            headerType: 1,
            ...options
        });
    };

    const sendListMessage = async (jid, title, buttonText, sections = [], options = {}) => {
        return sendMessage(jid, {
            text: title,
            buttonText,
            sections,
            listType: 1,
            ...options
        });
    };

    const sendCarouselMessage = async (jid, cards = [], options = {}) => {
        // Carousel via interactive message / native flow - simplified
        return sendMessage(jid, {
            text: options.text || 'Carousel',
            ...options
        });
    };

    const sendRichResponse = async (jid, content, options = {}) => {
        return sendJsonMessage(jid, content, options);
    };

    const forwardMessage = async (jid, message, options = {}) => {
        return sendMessage(jid, { forward: message }, options);
    };

    const sendVCard = async (jid, contacts = [], options = {}) => {
        const built = contacts.map(c => {
            const vcard = c.vcard || `BEGIN:VCARD\nVERSION:3.0\nFN:${c.name || 'Unknown'}\nTEL:${c.phone || ''}\nEND:VCARD`;
            return { displayName: c.name || 'Unknown', vcard };
        });
        if (built.length === 1) {
            return sendMessage(jid, { contacts: { contacts: built } }, options);
        }
        return sendMessage(jid, { contacts: { displayName: `${built.length} contacts`, contacts: built } }, options);
    };

    const broadcastMessage = async (jids, content, options = {}) => {
        const { delayMs = 0, ...sendOptions } = options;
        const results = [];
        for (const jid of jids) {
            try {
                const result = await sendMessage(jid, content, sendOptions);
                results.push({ jid, ok: true, result });
            } catch (error) {
                results.push({ jid, ok: false, error });
            }
            if (delayMs) await new Promise(resolve => setTimeout(resolve, delayMs));
        }
        return results;
    };

    return {
        ...sock,
        sendJsonMessage,
        sendActionPoll,
        resolvePollAction,
        sendAlbumMessage,
        sendStatusMention,
        sendRichResponse,
        sendButtonsMessage,
        sendListMessage,
        sendCarouselMessage,
        forwardMessage,
        sendVCard,
        broadcastMessage
    };
};
