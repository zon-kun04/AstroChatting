"use client";
import { useState, useCallback, useRef } from "react";
import { useWebSocket } from "@/hooks/use-websocket";
import { useCall } from "@/hooks/use-call";










export function usePageCall({ currentUserId, currentUsername }) {
  const [incomingCall, setIncomingCall] = useState(null);



  const sendRef = useRef(() => {
    console.warn("[usePageCall] WS not ready yet");
  });
  const stableSend = useCallback((event, data) => {
    sendRef.current(event, data);
  }, []);

  const call = useCall({
    currentUserId,
    currentUsername,
    send: stableSend,
    onIncomingCall: useCallback((c) => setIncomingCall(c), []),
    onCallEnded: useCallback(() => setIncomingCall(null), [])
  });

  const { send } = useWebSocket({ onEvent: call.wsHandlers });
  sendRef.current = send;

  const acceptCall = useCallback(async () => {
    if (!incomingCall) return;
    setIncomingCall(null);
    await call.acceptCall(incomingCall);
  }, [incomingCall, call]);

  const rejectCall = useCallback(() => {
    if (!incomingCall) return;
    call.rejectCall(incomingCall.callId);
    setIncomingCall(null);
  }, [incomingCall, call]);

  const startCall = useCallback(
    (targetUserId, targetUsername, mediaType) => {
      console.log("[usePageCall] startCall →", targetUserId, targetUsername, mediaType);
      call.initiateCall(targetUserId, targetUsername, mediaType);
    },
    [call]
  );

  return { call, incomingCall, acceptCall, rejectCall, startCall };
}