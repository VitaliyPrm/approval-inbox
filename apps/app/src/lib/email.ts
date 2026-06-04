import { Resend } from "resend";
import { MagicLinkEmail } from "../emails/magic-link";
import { CommentNotificationEmail } from "../emails/comment-notification";
import { ApprovalNotificationEmail } from "../emails/approval-notification";

const resend = new Resend(process.env.RESEND_API_KEY);
const from = "Approval Inbox <noreply@approvalinbox.app>";

export async function sendMagicLinkEmail(email: string, url: string) {
  return resend.emails.send({
    from,
    to: email,
    subject: "Sign in to Approval Inbox",
    react: MagicLinkEmail({ email, url }),
  });
}

export async function sendCommentNotification(params: {
  to: string;
  projectName: string;
  fileName: string;
  commenterName: string;
  commentContent: string;
  commentUrl: string;
}) {
  return resend.emails.send({
    from,
    to: params.to,
    subject: `New comment on ${params.projectName}`,
    react: CommentNotificationEmail(params),
  });
}

export async function sendApprovalNotification(params: {
  to: string;
  projectName: string;
  fileName: string;
  reviewerName: string;
  status: "approved" | "rejected" | "changes_requested";
  projectUrl: string;
}) {
  return resend.emails.send({
    from,
    to: params.to,
    subject: `File ${params.status} in ${params.projectName}`,
    react: ApprovalNotificationEmail(params),
  });
}