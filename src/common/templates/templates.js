export const emailTemplate = ({
    title,
    message,
    otp,
    expiresIn = "10 minutes",
}) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: #f5f6f8;
            font-family: Arial, Helvetica, sans-serif;
            color: #1f2937;
        }

        .wrapper {
            width: 100%;
            padding: 40px 16px;
            box-sizing: border-box;
        }

        .card {
            max-width: 520px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            padding: 32px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }

        .brand {
            font-size: 14px;
            font-weight: bold;
            color: #6366f1;
            letter-spacing: 1px;
            text-transform: uppercase;
            margin-bottom: 24px;
        }

        h1 {
            font-size: 22px;
            margin: 0 0 12px;
        }

        p {
            font-size: 15px;
            line-height: 1.6;
            margin: 0 0 16px;
            color: #4b5563;
        }

        .otp {
            display: block;
            text-align: center;
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
            color: #111827;
            background-color: #f3f4f6;
            border-radius: 8px;
            padding: 16px;
            margin: 24px 0;
        }

        .btn {
            display: inline-block;
            background-color: #6366f1;
            color: #ffffff !important;
            text-decoration: none;
            font-weight: bold;
            font-size: 15px;
            padding: 12px 28px;
            border-radius: 8px;
            margin: 8px 0 16px;
        }

        .note {
            font-size: 13px;
            color: #9ca3af;
        }

        .footer {
            text-align: center;
            font-size: 12px;
            color: #9ca3af;
            margin-top: 24px;
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="card">
            <div class="brand">Saraha App</div>

            <h1>${title}</h1>
            <p>${message}</p>

            ${otp ? `<span class="otp">${otp}</span>` : ""}

            <p class="note">
                This ${otp ? "code" : "link"} will expire in ${expiresIn}.
                If you didn't request this, you can safely ignore this email.
            </p>
        </div>

        <div class="footer">
            &copy; ${new Date().getFullYear()} Saraha App. All rights reserved.
        </div>
    </div>
</body>
</html>
`;
};