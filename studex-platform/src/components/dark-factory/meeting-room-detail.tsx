import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Users, Clock, CheckCircle2, Video, ChevronRight } from "lucide-react";
import type { MeetingRoom } from "@/lib/dark-factory-config";

interface MeetingRoomDetailProps {
  room: MeetingRoom;
  onJoin?: () => void;
  onClose?: () => void;
}

export function MeetingRoomDetail({
  room,
  onJoin,
  onClose,
}: MeetingRoomDetailProps) {
  return (
    <Card className="border-white/10 bg-gradient-to-br from-slate-800 to-slate-900">
      <CardHeader className="border-b border-white/10">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-5 h-5 text-pink-400" />
              <CardTitle className="text-white">{room.name}</CardTitle>
            </div>
            <p className="text-xs text-gray-500 font-mono">{room.id}</p>
          </div>
          <Badge
            className={
              room.status === "live"
                ? "bg-red-500/20 text-red-400 animate-pulse"
                : room.status === "scheduled"
                ? "bg-blue-500/20 text-blue-400"
                : "bg-gray-500/20 text-gray-400"
            }
          >
            {room.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Timing */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-cyan-400" />
            <h3 className="font-mono text-sm font-bold text-white">Meeting Time</h3>
          </div>
          <div className="p-3 rounded-lg bg-white/5 border border-white/10 font-mono text-sm">
            <p className="text-cyan-400">{room.startTime} - {room.endTime}</p>
            <p className="text-gray-500 text-xs mt-1">UTC Time</p>
          </div>
        </div>

        {/* Objectives */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            <h3 className="font-mono text-sm font-bold text-white">Objectives</h3>
          </div>
          <ul className="space-y-2">
            {room.objectives.map((objective, i) => (
              <div
                key={i}
                className="p-2.5 rounded-lg bg-white/5 border border-white/10 font-mono text-xs text-gray-300 flex gap-2"
              >
                <span className="text-green-400 flex-shrink-0">✓</span>
                <span>{objective}</span>
              </div>
            ))}
          </ul>
        </div>

        {/* Attendees */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-purple-400" />
            <h3 className="font-mono text-sm font-bold text-white">
              Attendees ({room.attendees.length})
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {room.attendees.map((attendee) => (
              <Badge
                key={attendee}
                className="bg-purple-500/20 text-purple-400 font-mono text-xs"
              >
                {attendee}
              </Badge>
            ))}
          </div>
        </div>

        {/* Notes */}
        {room.notes && (
          <div>
            <h3 className="font-mono text-sm font-bold text-white mb-3">Notes</h3>
            <p className="text-xs text-gray-300 leading-relaxed bg-white/5 border border-white/10 p-3 rounded-lg">
              {room.notes}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t border-white/10">
          {room.status === "live" && (
            <Button
              onClick={onJoin}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              <Video className="w-4 h-4 mr-2" />
              Join Meeting
            </Button>
          )}
          {room.status === "scheduled" && (
            <Button variant="outline" className="flex-1 text-blue-400">
              <Clock className="w-4 h-4 mr-2" />
              Set Reminder
            </Button>
          )}
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Close
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
