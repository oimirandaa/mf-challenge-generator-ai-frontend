export interface Quota {
    user_id: string;
    quota_remaining: number;
    last_reset_date: Date;
}
