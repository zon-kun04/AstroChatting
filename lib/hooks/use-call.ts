"use client";


import { useState, useRef, useCallback } from "react";












































const DEFAULT_ICE = [
{ urls: "stun:stun.l.google.com:19302" },
{ urls: "stun:stun1.l.google.com:19302" }];


const API_BASE = "http://localhost:3001";

function getToken() {
  try {
    const email = localStorage.getItem("auth_active_email");
    const accounts = JSON.parse(localStorage.getItem("auth_accounts") || "[]");
    return accounts.find((a) => a.email === email)?.token ?? null;
  } catch {return null;}
}

async function fetchUserInfo(userId)

{
  try {
    const token = getToken();
    const r = await fetch(`${API_BASE}/api/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!r.ok) return null;
    const data = await r.json();
    const u = data.user;
    return {
      displayName: u.displayName || u.username,
      username: u.username,
      avatar: u.avatar ? `${API_BASE}${u.avatar}` : null,
      avatarDecoration: u.decorations?.avatarDecoration && u.decorations.avatarDecoration !== "none" ?
      `${API_BASE}${u.decorations.avatarDecoration}` :
      null
    };
  } catch {return null;}
}

function playSound(type) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);gain.connect(ctx.destination);
    const now = ctx.currentTime;
    switch (type) {
      case "ring":
        osc.frequency.setValueAtTime(880, now);osc.frequency.setValueAtTime(660, now + 0.15);
        gain.gain.setValueAtTime(0.15, now);gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now);osc.stop(now + 0.4);break;
      case "mute":
        osc.frequency.setValueAtTime(400, now);osc.frequency.exponentialRampToValueAtTime(200, now + 0.15);
        gain.gain.setValueAtTime(0.1, now);gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);osc.stop(now + 0.15);break;
      case "unmute":
        osc.frequency.setValueAtTime(300, now);osc.frequency.exponentialRampToValueAtTime(600, now + 0.12);
        gain.gain.setValueAtTime(0.1, now);gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);osc.stop(now + 0.12);break;
      case "deafen":
        osc.frequency.setValueAtTime(500, now);osc.frequency.exponentialRampToValueAtTime(100, now + 0.2);
        gain.gain.setValueAtTime(0.12, now);gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.start(now);osc.stop(now + 0.2);break;
      case "undeafen":
        osc.frequency.setValueAtTime(200, now);osc.frequency.exponentialRampToValueAtTime(700, now + 0.18);
        gain.gain.setValueAtTime(0.12, now);gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc.start(now);osc.stop(now + 0.18);break;
      case "join":
        osc.type = "sine";
        osc.frequency.setValueAtTime(523, now);osc.frequency.setValueAtTime(659, now + 0.1);osc.frequency.setValueAtTime(784, now + 0.2);
        gain.gain.setValueAtTime(0.12, now);gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now);osc.stop(now + 0.4);break;
      case "leave":
        osc.type = "sine";
        osc.frequency.setValueAtTime(784, now);osc.frequency.setValueAtTime(523, now + 0.15);
        gain.gain.setValueAtTime(0.12, now);gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);osc.stop(now + 0.3);break;
    }
  } catch {}
}

export function useCall({
  currentUserId, currentUsername, send, onIncomingCall, onCallEnded
}) {

  const [activeCallId, setActiveCallId] = useState(null);
  const [callType, setCallType] = useState("voice");
  const [callStatus, setCallStatus] = useState("ended");
  const [participants, setParticipants] = useState([]);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [screenStream, setScreenStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [selectedMicId, setSelectedMicId] = useState(null);
  const [availableMics, setAvailableMics] = useState([]);

  const pcRef = useRef(null);
  const callIdRef = useRef(null);
  const isInitiator = useRef(false);
  const makingOffer = useRef(false);
  const ignoreOffer = useRef(false);
  const iceServersRef = useRef(DEFAULT_ICE);
  const localStreamRef = useRef(null);
  const screenStreamRef = useRef(null);

  const updateParticipant = useCallback((userId, patch) => {
    setParticipants((prev) => prev.map((p) => p.id === userId ? { ...p, ...patch } : p));
  }, []);

  const cleanup = useCallback(() => {
    pcRef.current?.close();pcRef.current = null;
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    screenStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;screenStreamRef.current = null;
    setLocalStream(null);setRemoteStream(null);setScreenStream(null);
    setParticipants([]);setActiveCallId(null);setCallStatus("ended");
    setIsMuted(false);setIsCameraOff(false);setIsDeafened(false);setIsScreenSharing(false);
    callIdRef.current = null;isInitiator.current = false;
    makingOffer.current = false;ignoreOffer.current = false;
    playSound("leave");
  }, []);

  const loadMics = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const mics = devices.filter((d) => d.kind === "audioinput");
      setAvailableMics(mics);
      if (mics.length > 0 && !selectedMicId) setSelectedMicId(mics[0].deviceId);
    } catch {}
  }, [selectedMicId]);

  const createPC = useCallback((iceServers) => {
    pcRef.current?.close();
    const pc = new RTCPeerConnection({ iceServers });
    pcRef.current = pc;
    const remote = new MediaStream();
    setRemoteStream(remote);
    pc.ontrack = (e) => {

      const incomingStream = e.streams[0];
      if (incomingStream) {
        incomingStream.getTracks().forEach((t) => {

          if (!remote.getTracks().find((existing) => existing.id === t.id)) {
            remote.addTrack(t);
          }
        });
      } else {

        if (!remote.getTracks().find((existing) => existing.id === e.track.id)) {
          remote.addTrack(e.track);
        }
      }

      setRemoteStream(new MediaStream(remote.getTracks()));
    };
    pc.onicecandidate = (e) => {
      if (e.candidate && callIdRef.current)
      send("call:ice_candidate", { callId: callIdRef.current, candidate: e.candidate });
    };
    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "connected") {setCallStatus("connected");playSound("join");}
      if (pc.connectionState === "failed") pc.restartIce();
    };
    return pc;
  }, [send]);

  const getMedia = useCallback(async (mediaType, micId) => {
    await loadMics();
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true, ...(micId ? { deviceId: { exact: micId } } : {}) },
      video: mediaType === "video" ? { width: { ideal: 1280 }, height: { ideal: 720 } } : false
    });
    localStreamRef.current = stream;
    setLocalStream(stream);
    setIsCameraOff(mediaType !== "video");
    return stream;
  }, [loadMics]);

  const wsHandlers = {
    "call:incoming": async (raw) => {
      const data = raw;
      iceServersRef.current = data.iceServers?.length ? data.iceServers : DEFAULT_ICE;
      const info = await fetchUserInfo(data.callerId);
      playSound("ring");
      onIncomingCall?.({ ...data, callerUsername: info?.displayName || data.callerUsername });
    },
    "call:initiated": (raw) => {
      const data = raw;
      callIdRef.current = data.callId;setActiveCallId(data.callId);
      if (data.iceServers?.length) iceServersRef.current = data.iceServers;
    },
    "call:accepted": async (raw) => {
      const data = raw;
      const info = await fetchUserInfo(data.peerId);
      setParticipants((prev) => prev.find((p) => p.id === data.peerId) ?
      prev.map((p) => p.id === data.peerId ? { ...p, displayName: info?.displayName || p.displayName, avatar: info?.avatar || p.avatar, avatarDecoration: info?.avatarDecoration || null } : p) :
      [...prev, { id: data.peerId, displayName: info?.displayName || data.peerUsername, username: info?.username || data.peerUsername, avatar: info?.avatar || null, avatarDecoration: info?.avatarDecoration || null, isMuted: false, isCameraOff: data.mediaType !== "video", isSpeaking: false, isScreenSharing: false }]
      );
      if (isInitiator.current && pcRef.current) {
        try {
          makingOffer.current = true;
          const offer = await pcRef.current.createOffer();
          await pcRef.current.setLocalDescription(offer);
          send("call:offer", { callId: callIdRef.current, sdp: pcRef.current.localDescription });
        } finally {makingOffer.current = false;}
      }
    },
    "call:offer": async (raw) => {
      const data = raw;
      const pc = pcRef.current;if (!pc) return;
      const collision = makingOffer.current || pc.signalingState !== "stable";
      ignoreOffer.current = !isInitiator.current && collision;
      if (ignoreOffer.current) return;
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        send("call:answer", { callId: callIdRef.current, sdp: pc.localDescription });
      } catch (err) {console.error("[WebRTC] offer error", err);}
    },
    "call:answer": async (raw) => {
      const data = raw;
      const pc = pcRef.current;if (!pc) return;
      try {await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));}
      catch (err) {console.error("[WebRTC] answer error", err);}
    },
    "call:ice_candidate": async (raw) => {
      const data = raw;
      const pc = pcRef.current;if (!pc || !data.candidate) return;
      try {await pc.addIceCandidate(new RTCIceCandidate(data.candidate));}
      catch (err) {if (!ignoreOffer.current) console.error("[WebRTC] ICE", err);}
    },
    "call:participant_update": (raw) => {
      const data = raw;
      updateParticipant(data.userId, {
        isMuted: !data.audioEnabled,

        isCameraOff: data.screenSharing ? false : !data.videoEnabled,
        isScreenSharing: data.screenSharing
      });
    },
    "call:ended": (raw) => {onCallEnded?.(raw);cleanup();},
    "call:missed": () => {playSound("leave");cleanup();},
    "call:rejected": () => {playSound("leave");cleanup();},
    "call:busy": () => cleanup(),
    "call:renegotiate": async (raw) => {
      const data = raw;
      const pc = pcRef.current;
      if (!pc) {console.warn("[renegotiate] no pc");return;}

      const cid = data.callId || callIdRef.current;
      console.log("[renegotiate] received type:", data.type, "callId:", cid, "signalingState:", pc.signalingState);
      try {
        if (data.type === "offer") {

          if (pc.signalingState !== "stable") {
            console.warn("[renegotiate] not stable, waiting...", pc.signalingState);
            await new Promise((r) => setTimeout(r, 300));
          }
          await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          console.log("[renegotiate] sending answer for callId:", cid);
          send("call:renegotiate", { callId: cid, sdp: pc.localDescription, type: "answer" });
        } else {
          await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
          console.log("[renegotiate] applied answer ok");
        }
      } catch (err) {console.error("[WebRTC] renegotiate error", err);}
    }
  };

  const initiateCall = useCallback(async (targetUserId, targetUsername, mediaType = "audio") => {
    const [info, stream] = await Promise.all([fetchUserInfo(targetUserId), getMedia(mediaType, selectedMicId)]);
    const pc = createPC(iceServersRef.current);
    stream.getTracks().forEach((t) => pc.addTrack(t, stream));
    isInitiator.current = true;
    setCallType(mediaType === "video" ? "video" : "voice");
    setCallStatus("calling");
    setActiveCallId("pending");

    playSound("ring");
    setParticipants([
    { id: currentUserId, displayName: currentUsername, username: currentUsername, isMuted: false, isCameraOff: mediaType !== "video", isSpeaking: false, isScreenSharing: false },
    { id: targetUserId, displayName: info?.displayName || targetUsername, username: info?.username || targetUsername, avatar: info?.avatar || null, avatarDecoration: info?.avatarDecoration || null, isMuted: false, isCameraOff: true, isSpeaking: false, isScreenSharing: false }]
    );
    send("call:initiate", { targetUserId, mediaType });
  }, [currentUserId, currentUsername, getMedia, createPC, send, selectedMicId]);

  const acceptCall = useCallback(async (incoming) => {
    iceServersRef.current = incoming.iceServers?.length ? incoming.iceServers : DEFAULT_ICE;
    const mediaType = incoming.mediaType === "screen_share" ? "video" : incoming.mediaType;
    const [callerInfo, stream] = await Promise.all([fetchUserInfo(incoming.callerId), getMedia(mediaType, selectedMicId)]);
    const pc = createPC(iceServersRef.current);
    stream.getTracks().forEach((t) => pc.addTrack(t, stream));
    isInitiator.current = false;callIdRef.current = incoming.callId;
    setActiveCallId(incoming.callId);setCallType(mediaType === "video" ? "video" : "voice");setCallStatus("ringing");
    setParticipants([
    { id: currentUserId, displayName: currentUsername, username: currentUsername, isMuted: false, isCameraOff: mediaType !== "video", isSpeaking: false, isScreenSharing: false },
    { id: incoming.callerId, displayName: callerInfo?.displayName || incoming.callerUsername, username: callerInfo?.username || incoming.callerUsername, avatar: callerInfo?.avatar || null, avatarDecoration: callerInfo?.avatarDecoration || null, isMuted: false, isCameraOff: incoming.mediaType !== "video", isSpeaking: false, isScreenSharing: false }]
    );
    send("call:accept", { callId: incoming.callId });
  }, [currentUserId, currentUsername, getMedia, createPC, send, selectedMicId]);

  const rejectCall = useCallback((callId) => send("call:reject", { callId }), [send]);
  const endCall = useCallback(() => {if (callIdRef.current) send("call:end", { callId: callIdRef.current });cleanup();}, [send, cleanup]);

  const toggleMute = useCallback(() => {
    const stream = localStreamRef.current;if (!stream || !callIdRef.current) return;
    const next = !isMuted;
    stream.getAudioTracks().forEach((t) => {t.enabled = !next;});
    setIsMuted(next);updateParticipant(currentUserId, { isMuted: next });
    send("call:toggle_audio", { callId: callIdRef.current, enabled: !next });
    playSound(next ? "mute" : "unmute");
  }, [isMuted, currentUserId, updateParticipant, send]);

  const toggleCamera = useCallback(() => {
    const stream = localStreamRef.current;if (!stream || !callIdRef.current) return;
    const next = !isCameraOff;
    stream.getVideoTracks().forEach((t) => {t.enabled = !next;});
    setIsCameraOff(next);updateParticipant(currentUserId, { isCameraOff: next });
    send("call:toggle_video", { callId: callIdRef.current, enabled: !next });
  }, [isCameraOff, currentUserId, updateParticipant, send]);

  const toggleDeafen = useCallback(() => {
    const next = !isDeafened;setIsDeafened(next);
    localStreamRef.current?.getAudioTracks().forEach((t) => {t.enabled = !next;});
    playSound(next ? "deafen" : "undeafen");
  }, [isDeafened]);

  const toggleScreenShare = useCallback(async () => {
    const pc = pcRef.current;if (!pc || !callIdRef.current) return;
    if (isScreenSharing) {
      screenStreamRef.current?.getTracks().forEach((t) => t.stop());
      screenStreamRef.current = null;setScreenStream(null);setIsScreenSharing(false);
      updateParticipant(currentUserId, { isScreenSharing: false });
      send("call:screen_share_stop", { callId: callIdRef.current });
      const camTrack = localStreamRef.current?.getVideoTracks()[0];
      if (camTrack) pc.getSenders().find((s) => s.track?.kind === "video")?.replaceTrack(camTrack);
      const offer = await pc.createOffer();await pc.setLocalDescription(offer);
      send("call:renegotiate", { callId: callIdRef.current, sdp: pc.localDescription, type: "offer" });
    } else {
      try {
        const screen = await navigator.mediaDevices.getDisplayMedia({ video: { frameRate: { ideal: 60 } }, audio: false });
        screenStreamRef.current = screen;setScreenStream(screen);setIsScreenSharing(true);
        updateParticipant(currentUserId, { isScreenSharing: true });
        console.log("[screenShare] starting, callId:", callIdRef.current, "has video sender:", !!pc.getSenders().find((s) => s.track?.kind === "video"));
        send("call:screen_share_start", { callId: callIdRef.current });
        const track = screen.getVideoTracks()[0];
        const sender = pc.getSenders().find((s) => s.track?.kind === "video");
        if (sender) await sender.replaceTrack(track);else pc.addTrack(track, screen);
        const offer = await pc.createOffer();await pc.setLocalDescription(offer);
        send("call:renegotiate", { callId: callIdRef.current, sdp: pc.localDescription, type: "offer" });
        track.onended = () => toggleScreenShare();
      } catch (err) {console.error("[WebRTC] screen share error", err);}
    }
  }, [isScreenSharing, currentUserId, updateParticipant, send]);

  const selectMic = useCallback(async (deviceId) => {
    setSelectedMicId(deviceId);
    const pc = pcRef.current;if (!pc || !callIdRef.current) return;
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({ audio: { deviceId: { exact: deviceId }, echoCancellation: true, noiseSuppression: true }, video: false });
      const newTrack = newStream.getAudioTracks()[0];
      const sender = pc.getSenders().find((s) => s.track?.kind === "audio");
      if (sender) await sender.replaceTrack(newTrack);
      const stream = localStreamRef.current;
      if (stream) {stream.getAudioTracks().forEach((t) => {t.stop();stream.removeTrack(t);});stream.addTrack(newTrack);}
    } catch (err) {console.error("[useCall] selectMic error", err);}
  }, []);

  return {
    activeCallId, callType, callStatus, participants,
    localStream, remoteStream, screenStream,
    isMuted, isCameraOff, isDeafened, isScreenSharing,
    selectedMicId, availableMics,
    initiateCall, acceptCall, rejectCall, endCall,
    toggleMute, toggleCamera, toggleDeafen, toggleScreenShare,
    selectMic, wsHandlers
  };
}