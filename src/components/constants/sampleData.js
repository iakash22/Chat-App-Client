

export const sampleChats = [
    {
        avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
        name: "Jhon deo",
        _id: "1",
        groupChat: false,
        members: ["1", "2"],
    },
    {
        avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
        name: "Jhonny wonk",
        _id: "2",
        groupChat: false,
        members: ["1", "2"],
    },
];

export const sampleUsers = [
    {
        avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
        name: "Jhon deo",
        _id: "1",
    },
    {
        avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
        name: "Jhonny wonk",
        _id: "2",
    },
];

export const sampleNotifications = [
    {
        sender: {
            name: "Jhon deo",
            avatar: "https://www.w3schools.com/howto/img_avatar.png",
        },
        _id: "1",
    },
    {
        sender: {
            name: "Jhonny wonk",
            avatar: "https://www.w3schools.com/howto/img_avatar.png",
        },
        _id: "2",
    },
]

export const sampleMessage = [
    {
        attachments: [
        ],
        content: "Hello",
        id: "123456",
        sender: {
            _id: "user._id",
            name: "chaman",
        },
        chat: "chatId",
        createdAt: "2024-02-12T10:41:30.630Z",
    },
    {
        attachments: [
            {
                public_id: "12",
                url: "https://www.w3schools.com/howto/img_avatar.png"
            },
        ],
        content: "",
        id: "123456",
        sender: {
            _id: "1",
            name: "Jhon deo",
        },
        chat: "chatId",
        createdAt: "2024-09-16T10:41:30.630Z",
    },
]

export const dashboardData = {
    users: [
        {
            name: "Jhon deo",
            avatar: "https://www.w3schools.com/howto/img_avatar.png",
            _id: "1",
            username: "jhon_deo",
            friends: 20,
            groups: 5,
        },
        {
            name: "Alex",
            avatar: "https://www.w3schools.com/howto/img_avatar.png",
            _id: "2",
            username: "iam_alex",
            friends: 100,
            groups: 51,
        },
        {
            name: "Crazy Sem",
            avatar: "https://www.w3schools.com/howto/img_avatar.png",
            _id: "3",
            username: "crazy_sem",
            friends: 150,
            groups: 15,
        },
    ],
    chats: [
        {
            _id: "1",
            name: "MastRam Group",
            avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
            groupChat: false,
            members: [
                {
                    _id: "1",
                    avatar: "https://www.w3schools.com/howto/img_avatar.png",
                },
                {
                    _id: "2",
                    avatar: "https://www.w3schools.com/howto/img_avatar.png",
                },
            ],
            totalMembers: 2,
            totalMessages: 20,
            creator: {
                name: "John deo",
                avatar: "https://www.w3schools.com/howto/img_avatar.png",
            },
        },
        {
            _id: "2",
            name: "Adult Group",
            avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
            groupChat: false,
            members: [
                {
                    _id: "3",
                    avatar: "https://www.w3schools.com/howto/img_avatar.png",
                },
                {
                    _id: "2",
                    avatar: "https://www.w3schools.com/howto/img_avatar.png",
                },
                {
                    _id: "1",
                    avatar: "https://www.w3schools.com/howto/img_avatar.png",
                },
                {
                    _id: "4",
                    avatar: "https://www.w3schools.com/howto/img_avatar.png",
                },
                {
                    _id: "5",
                    avatar: "https://www.w3schools.com/howto/img_avatar.png",
                },
            ],
            totalMembers: 5,
            totalMessages: 80,
            creator: {
                name: "Leo deo",
                avatar: "https://www.w3schools.com/howto/img_avatar.png",
            },
        },
    ],
    messages: [
        {
            attachments: [],
            content: "sdfgvbhjn",
            _id: "1",
            sender: {
                _id: "2",
                name: "chaman",
                avatar : "https://www.w3schools.com/howto/img_avatar.png",
            },
            groupChat : false,
            chat: "123",
            createdAt : "2024-07-12T10:41:30.630Z",
        },
        {
            attachments: [
                {
                    public_id: "asd2",
                    url : "https://www.w3schools.com/howto/img_avatar.png",
                }
            ],
            content: "sdfgvbhjn",
            _id: "2",
            sender: {
                _id: "3",
                name: "chaman 2",
                avatar : "https://www.w3schools.com/howto/img_avatar.png",
            },
            groupChat : true,
            chat: "124",
            createdAt : "2024-09-12T10:41:30.630Z",
        },
    ]
}