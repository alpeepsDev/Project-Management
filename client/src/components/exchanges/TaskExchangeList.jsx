import React, { useState } from "react";
import { Button, Badge, Card } from "../ui";

const TaskExchangeList = ({
  exchanges,
  userRole,
  currentUserId,
  onRespond,
  onCancel,
}) => {
  const [respondingTo, setRespondingTo] = useState(null);
  const [responseNote, setResponseNote] = useState("");

  // Separate incoming and outgoing exchanges
  const incomingExchanges = exchanges.filter(
    (ex) => ex.receiverId === currentUserId,
  );
  const outgoingExchanges = exchanges.filter(
    (ex) => ex.requesterId === currentUserId,
  );

  const handleRespond = async (exchangeId, status) => {
    try {
      await onRespond(exchangeId, status, responseNote);
      setRespondingTo(null);
      setResponseNote("");
    } catch (error) {
      console.error("Response failed:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "warning";
      case "ACCEPTED":
        return "success";
      case "REJECTED":
        return "danger";
      default:
        return "default";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Incoming Requests */}
      <Card
        title="Incoming Exchange Requests"
        subtitle="Requests from your teammates"
      >
        <div className="space-y-4">
          {incomingExchanges.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <div className="text-3xl mb-2">📥</div>
              <p>No incoming exchange requests</p>
            </div>
          ) : (
            incomingExchanges.map((exchange) => (
              <div key={exchange.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={getStatusColor(exchange.status)}>
                        {exchange.status}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        From:{" "}
                        <span className="font-medium">
                          {exchange.requester.username}
                        </span>
                      </span>
                    </div>
                    <h4 className="font-medium text-gray-900">
                      {exchange.task.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {exchange.task.description}
                    </p>
                    {exchange.requestNote && (
                      <div className="bg-blue-50 border-l-4 border-blue-200 p-2 mb-2">
                        <p className="text-sm text-blue-800 italic">
                          "{exchange.requestNote}"
                        </p>
                      </div>
                    )}
                    <div className="text-xs text-gray-500">
                      Requested: {formatDate(exchange.createdAt)}
                    </div>
                  </div>

                  {exchange.status === "PENDING" && (
                    <div className="flex gap-2 ml-4">
                      {respondingTo === exchange.id ? (
                        <div className="space-y-2">
                          <textarea
                            value={responseNote}
                            onChange={(e) => setResponseNote(e.target.value)}
                            placeholder="Optional response message..."
                            rows={2}
                            className="w-64 px-2 py-1 border rounded text-sm"
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="success"
                              onClick={() =>
                                handleRespond(exchange.id, "ACCEPTED")
                              }
                            >
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() =>
                                handleRespond(exchange.id, "REJECTED")
                              }
                            >
                              Reject
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => {
                                setRespondingTo(null);
                                setResponseNote("");
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => setRespondingTo(exchange.id)}
                        >
                          Respond
                        </Button>
                      )}
                    </div>
                  )}
                </div>

                {exchange.responseNote && (
                  <div className="bg-gray-50 border-l-4 border-gray-200 p-2 mt-2">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Response:</span> "
                      {exchange.responseNote}"
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Outgoing Requests */}
      <Card
        title="My Exchange Requests"
        subtitle="Requests you've sent to teammates"
      >
        <div className="space-y-4">
          {outgoingExchanges.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <div className="text-3xl mb-2">📤</div>
              <p>No outgoing exchange requests</p>
            </div>
          ) : (
            outgoingExchanges.map((exchange) => (
              <div key={exchange.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={getStatusColor(exchange.status)}>
                        {exchange.status}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        To:{" "}
                        <span className="font-medium">
                          {exchange.receiver.username}
                        </span>
                      </span>
                    </div>
                    <h4 className="font-medium text-gray-900">
                      {exchange.task.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {exchange.task.description}
                    </p>
                    {exchange.requestNote && (
                      <div className="bg-green-50 border-l-4 border-green-200 p-2 mb-2">
                        <p className="text-sm text-green-800">
                          <span className="font-medium">Your message:</span> "
                          {exchange.requestNote}"
                        </p>
                      </div>
                    )}
                    <div className="text-xs text-gray-500">
                      Sent: {formatDate(exchange.createdAt)}
                      {exchange.respondedAt && (
                        <span>
                          {" "}
                          • Responded: {formatDate(exchange.respondedAt)}
                        </span>
                      )}
                    </div>
                  </div>

                  {exchange.status === "PENDING" && onCancel && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => onCancel(exchange.id)}
                    >
                      Cancel Request
                    </Button>
                  )}
                </div>

                {exchange.responseNote && (
                  <div
                    className={`border-l-4 p-2 mt-2 ${
                      exchange.status === "ACCEPTED"
                        ? "bg-green-50 border-green-200"
                        : "bg-red-50 border-red-200"
                    }`}
                  >
                    <p
                      className={`text-sm ${
                        exchange.status === "ACCEPTED"
                          ? "text-green-800"
                          : "text-red-800"
                      }`}
                    >
                      <span className="font-medium">
                        {exchange.receiver.username}'s response:
                      </span>{" "}
                      "{exchange.responseNote}"
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Manager/Moderator View */}
      {(userRole === "MANAGER" || userRole === "MODERATOR") && (
        <Card
          title="All Exchange Activity"
          subtitle="Monitor team exchange activity"
        >
          <div className="space-y-3">
            {exchanges.slice(0, 5).map((exchange) => (
              <div
                key={exchange.id}
                className="flex items-center justify-between border-b pb-2"
              >
                <div>
                  <p className="font-medium text-sm">
                    {exchange.requester.username} → {exchange.receiver.username}
                  </p>
                  <p className="text-sm text-gray-600">{exchange.task.title}</p>
                  <p className="text-xs text-gray-500">
                    {formatDate(exchange.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusColor(exchange.status)}>
                    {exchange.status}
                  </Badge>
                  {userRole === "MODERATOR" &&
                    exchange.status === "ACCEPTED" && (
                      <Button size="sm" variant="warning">
                        Review
                      </Button>
                    )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default TaskExchangeList;
