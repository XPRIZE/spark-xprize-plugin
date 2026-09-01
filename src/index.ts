import Spark from "@vatom/spark-sdk";

// This descriptor is used to describe the plugin to the vatom client
const descriptor: any = {
  namespace: "xprize.org", // namepsace of the room events - e.g. io.dgov.room.poll
  plugin_id: "xprize",
  message_types: "message", // These are the messages owned by the plugin - the room events will be in the namespace
  facades: {
    message: [
      {
        id: "m.room.message",
        actions: ["reply", "react", "flag"],
        name: "Post",
      },
      {
        id: "v.room.poll",
        actions: ["reply", "react", "flag"],
        name: "Poll",
      },
      // {
      //   id: "v.room.score",
      //   actions: ["reply", "react", "flag"],
      //   name: "Score",
      // },
      {
        id: "v.room.sketch",
        actions: ["reply", "react", "flag"],
        name: "Sketch",
      },
      {
        id: "v.room.vote",
        actions: ["reply", "react", "flag"],
        name: "Vote",
      },
    ],
    modal: [
      {
        event: "message.new",
        name: "New Topic",
        message_type: "v.room.topic",
      },
    ],
    badge: [],
  },
  room_filters: [
    {
      name: "Sketches",
      message_type: "v.room.sketch",
    },
    {
      name: "Votes",
      message_type: "v.room.vote",
    },
    {
      name: "Polls",
      message_type: "v.room.poll",
    },
    {
      name: "Posts",
      message_type: "m.room.message",
    },
    // {
    //   name: "Sketches",
    //   message_type: "v.room.sketch",
    // },
  ],
  member_filters: [
    {
      name: "Sketches",
      message_type: "v.room.sketch",
    },
    {
      name: "Votes",
      message_type: "v.room.vote",
    },
    {
      name: "Polls",
      message_type: "v.room.poll",
    },
    {
      name: "Posts",
      message_type: "m.room.message",
    },
    // {
    //   name: "Sketches",
    //   message_type: "v.room.sketch",
    // },
  ],
  controls: [],
};

// This is the client id and secret for the plugin - used to communicate back to the Spark Engine. These are issued per plugin
const clientId = "xprize-plugin";
const clientSecret = "uDxwfnKpfgecJlVt5I8MV";

const spark = new Spark(descriptor, clientId, clientSecret);

spark.start();

spark.on("invalidEvent", (e: any) => {});

spark.on("get.facades.message", async () => {
  return descriptor.facades.message;
});

spark.on("get.descriptor", async () => {
  //event to return descriptor in order to cache it
  return descriptor;
});

spark.on("message.new", async (data: any) => {
  console.info("Received message.new", data);

  const { messageTypes } = data;
  return messageTypes.map((messageType: string) => {
    if (messageType === "m.room.message") {
      return {
        type: messageType,
        inputs: [
          {
            type: "text",
            placeholder: "Description",
          },
        ],
      };
    }

    if (messageType === "v.room.proposal") {
      return {
        type: messageType,
        inputs: [
          {
            type: "title",
            placeholder: "Proposal Title",
          },
          {
            type: "text",
            placeholder: "Description",
          },
          {
            type: "decorations",
            elements: [
              {
                type: "allow-vote",
                placeholder: "Allow vote",
                value: "boolean",
              },
              {
                type: "attach-documents",
                placeholder: "Attach Documents",
              },
            ],
          },
        ],
      };
    }

    // if (messageType === "v.room.poll") {
    //   return {
    //     type: messageType,
    //     inputs: [
    //       {
    //         type: "title",
    //         placeholder: "Ask a Question",
    //       },
    //       {
    //         type: "text",
    //         placeholder: "Add some details...",
    //       },
    //       {
    //         type: "decorations",
    //         elements: [
    //           {
    //             type: "poll-length",
    //             placeholder: "Poll Length",
    //             value: "number",
    //           },
    //           {
    //             type: "hide-results",
    //             placeholder: "Hide results until end",
    //             value: "boolean",
    //           },
    //         ],
    //       },
    //     ],
    //   };
    // }

    // if (messageType === "v.room.score") {
    //   return {
    //     type: messageType,
    //     inputs: [
    //       {
    //         type: "title",
    //         placeholder: "Ask a question",
    //       },
    //       {
    //         type: "text",
    //         placeholder: "Add some details...",
    //       },
    //       {
    //         type: "decorations",
    //         elements: [
    //           {
    //             type: "score-style",
    //             placeholder: "Style",
    //             data: {
    //               styles: [
    //                 "numbered-1-5",
    //                 "numbered-0-5",
    //                 "numbered-1-10",
    //                 "numbered-0-10",
    //                 "emojies",
    //                 "stars",
    //               ],
    //             },
    //             value: "string",
    //           },
    //           {
    //             type: "response-anchors",
    //             placeholder: "Response Anchors",
    //             value: "string",
    //           },
    //           {
    //             type: "poll-length",
    //             placeholder: "Scoring Window",
    //             value: "number",
    //           },
    //           {
    //             type: "hide-results",
    //             placeholder: "Hide results until end",
    //             value: "boolean",
    //           },
    //         ],
    //       },
    //     ],
    //   };
    // }

    if (messageType === "v.room.poll") {
      return {
        type: messageType,
        inputs: [
          {
            type: "title",
            placeholder: "Ask a question",
          },
          {
            type: "text",
            placeholder: "Add some details...",
          },
          {
            type: "decorations",
            elements: [
              {
                type: "score-style",
                placeholder: "Style",
                data: {
                  styles: [
                    "single-choice-poll",
                    "numbered-1-5",
                    "numbered-0-5",
                    "numbered-0-4",
                    "numbered-1-10",
                    "numbered-0-10",
                    "emojies",
                    "stars",
                  ],
                },
                value: "string",
              },
              {
                type: "poll-length",
                placeholder: "Scoring Window",
                value: "number",
              },
              {
                type: "hide-results",
                placeholder: "Hide results until end",
                value: "boolean",
              },
            ],
          },
        ],
      };
    }

    if (messageType === "v.room.sketch") {
      return {
        type: messageType,
        inputs: [
          {
            type: "title",
            placeholder: "Add a title",
          },
          {
            type: "text",
            placeholder: "Add some details...",
          },
          {
            type: "decorations",
            elements: [
              {
                type: "questions",
                placeholder: "Questions",
                value: "number",
              },
              {
                type: "start-time",
                placeholder: "Scoring Starts",
                value: "number",
              },
              {
                type: "end-time",
                placeholder: "Scoring Ends",
                value: "number",
              },
            ],
          },
        ],
      };
    }

    if (messageType === "v.room.vote") {
      return {
        type: messageType,
        inputs: [
          {
            type: "title",
            placeholder: "Add a title",
          },
          {
            type: "text",
            placeholder: "Add some details...",
          },
          {
            type: "decorations",
            elements: [
              {
                type: "sketches",
                placeholder: "Sketches",
                value: "number",
              },
              {
                type: "start-time",
                placeholder: "Vote Starts",
                value: "number",
              },
              {
                type: "end-time",
                placeholder: "Vote Ends",
                value: "number",
              },
            ],
          },
        ],
      };
    }

    if (messageType === "v.room.reply") {
      return {
        type: messageType,
        inputs: [
          {
            type: "text",
            placeholder: "Some thoughtful commentary...",
          },
        ],
      };
    }
  });
});

spark.on("message.display", async (data: any) => {
  console.info("Received message.display", data);

  const { messageTypes } = data;
  return messageTypes.map((messageType: string) => {
    if (messageType === "m.room.message") {
      return {
        type: messageType,
        elements: [
          {
            type: "header",
            variation: "classic",
            decorations: [],
          },
          {
            type: "content",
            align: "indent",
            elements: [
              {
                type: "text",
                content: "{{message.body}}",
                style: "paragraph",
              },
              {
                type: "media",
                content: "{{message.media}}",
              },
            ],
          },
          {
            type: "decorations",
            elements: [
              {
                type: "reactions",
                style: "classic",
                align: "indent",
              },
              {
                type: "replies",
                style: "classic",
                align: "indent",
              },
            ],
          },
        ],
      };
    }

    if (messageType === "v.room.proposal") {
      return {
        type: messageType,
        elements: [
          {
            type: "header",
            variation: "detailed",
          },
          {
            type: "badge",
            align: "indent",
          },
          {
            type: "content",
            elements: [
              {
                type: "title",
                content: "{{message.title}}",
                style: "title",
              },
              {
                type: "text",
                content: "{{message.body}}",
                style: "paragraph",
              },
              {
                type: "media",
                content: "{{message.media}}",
              },
            ],
          },
          {
            type: "decorations",
            elements: [
              {
                type: "row",
                elements: [
                  {
                    type: "votes",
                    style: "classic",
                  },
                  {
                    type: "replies",
                    style: "classic",
                  },
                ],
              },
            ],
          },
        ],
      };
    }

    // if (messageType === "v.room.poll") {
    //   return {
    //     type: messageType,
    //     elements: [
    //       {
    //         type: "header",
    //         variation: "classic",
    //       },
    //       {
    //         type: "content",
    //         align: "indent",
    //         elements: [
    //           {
    //             type: "title",
    //             content: "{{message.body}}",
    //             style: "paragraph",
    //           },
    //           {
    //             type: "text",
    //             content: "{{message.body}}",
    //             style: "paragraph",
    //           },
    //           {
    //             type: "media",
    //             content: "{{message.media}}",
    //           },
    //           {
    //             type: "choices",
    //           },
    //         ],
    //       },
    //       {
    //         type: "decorations",
    //         elements: [
    //           {
    //             type: "reactions",
    //             style: "classic",
    //             align: "indent",
    //           },
    //           {
    //             type: "replies",
    //             style: "classic",
    //             align: "indent",
    //           },
    //         ],
    //       },
    //     ],
    //   };
    // }

    // if (messageType === "v.room.score") {
    //   return {
    //     type: messageType,
    //     elements: [
    //       {
    //         type: "header",
    //         variation: "classic",
    //       },
    //       {
    //         type: "content",
    //         align: "indent",
    //         elements: [
    //           {
    //             type: "title",
    //             content: "{{message.title}}",
    //             style: "title",
    //           },
    //           {
    //             type: "text",
    //             content: "{{message.body}}",
    //             style: "paragraph",
    //           },
    //           {
    //             type: "media",
    //             content: "{{message.media}}",
    //           },
    //           {
    //             type: "score",
    //           },
    //         ],
    //       },
    //       {
    //         type: "decorations",
    //         elements: [
    //           {
    //             type: "reactions",
    //             style: "classic",
    //             align: "indent",
    //           },
    //           {
    //             type: "replies",
    //             style: "classic",
    //             align: "indent",
    //           },
    //         ],
    //       },
    //     ],
    //   };
    // }

    if (messageType === "v.room.poll") {
      return {
        type: messageType,
        elements: [
          {
            type: "header",
            variation: "classic",
          },
          {
            type: "content",
            align: "indent",
            elements: [
              {
                type: "title",
                content: "{{message.body}}",
                style: "paragraph",
              },
              {
                type: "text",
                content: "{{message.body}}",
                style: "paragraph",
              },
              {
                type: "media",
                content: "{{message.media}}",
              },
              {
                type: "choices",
              },
              {
                type: "score",
              },
            ],
          },
          {
            type: "decorations",
            elements: [
              {
                type: "reactions",
                style: "classic",
                align: "indent",
              },
              {
                type: "replies",
                style: "classic",
                align: "indent",
              },
            ],
          },
        ],
      };
    }

    if (messageType === "v.room.sketch") {
      return {
        type: messageType,
        elements: [
          {
            type: "header",
            variation: "classic",
          },
          {
            type: "content",
            align: "indent",
            elements: [
              {
                type: "title",
                content: "{{message.body}}",
                style: "paragraph",
              },
              {
                type: "text",
                content: "{{message.body}}",
                style: "paragraph",
              },
              {
                type: "media",
                content: "{{message.media}}",
              },
              {
                type: "questions",
              },
            ],
          },
          {
            type: "decorations",
            elements: [
              {
                type: "reactions",
                style: "classic",
                align: "indent",
              },
              {
                type: "replies",
                style: "classic",
                align: "indent",
              },
            ],
          },
        ],
      };
    }

    if (messageType === "v.room.vote") {
      return {
        type: messageType,
        elements: [
          {
            type: "header",
            variation: "classic",
          },
          {
            type: "content",
            align: "indent",
            elements: [
              {
                type: "title",
                content: "{{message.body}}",
                style: "paragraph",
              },
              {
                type: "text",
                content: "{{message.body}}",
                style: "paragraph",
              },
              {
                type: "media",
                content: "{{message.media}}",
              },
              {
                type: "sketches",
              },
            ],
          },
          {
            type: "decorations",
            elements: [
              {
                type: "reactions",
                style: "classic",
                align: "indent",
              },
              {
                type: "replies",
                style: "classic",
                align: "indent",
              },
            ],
          },
        ],
      };
    }

    if (messageType === "v.room.reply") {
      return {
        type: messageType,
        elements: [
          {
            type: "header",
            variation: "classic",
            decorations: [],
          },
          {
            type: "content",
            align: "indent",
            elements: [
              {
                type: "text",
                content: "{{message.body}}",
                style: "paragraph",
              },
              {
                type: "media",
                content: "{{message.media}}",
              },
            ],
          },
          {
            type: "decorations",
            elements: [
              {
                type: "row",
                align: "indent",
                elements: [
                  {
                    type: "reactions",
                    style: "classic",
                  },
                ],
              },
            ],
          },
        ],
      };
    }
  });
});

// Called when a user posts a message
spark.on("m.room.message", async (message: any) => {
  // Look for posted replies with a vote
  // Call the backend to increment the score
  console.info("Received message", message);
});

// Called when a user posts a reply
spark.on("v.room.reply", async (message: any) => {
  console.info("Received reply", message);
  const { room_id, content, sender } = message;
  if (!room_id) return; // This is needed because there are currently two events being sent, one with a roomId and one without
  const parentMessageId = content["m.relates_to"].event_id;

  // Retrieve m.room.member event for the user
  // const events = await spark.getRoomEvents(room_id, {
  //   types: ["m.room.member"],
  //   senders: [sender],
  // });

  // const memberEvent = events?.chunk[0];

  // console.info("Found member event", memberEvent);
});
