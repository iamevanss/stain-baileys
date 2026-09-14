import { makeCommunitiesSocket } from './communities.js';

/**
 * Interop layer - handles cross-platform / interoperability features
 */
export const makeInteropSocket = (sock) => {
    // If sock is already a full socket, wrap it; otherwise build from config
    const base = typeof sock === 'object' && sock.query ? sock : makeCommunitiesSocket(sock);

    const interopQuery = async (node) => {
        return base.query(node);
    };

    return {
        ...base,
        interopQuery,
        // Additional interop helpers can be added here
    };
};
