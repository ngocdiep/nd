export class User {
    id: number;
    firstName: string;
    lastName: string;
    avatarUrl: string;

    fullName(): string {
        return (this.firstName ? (this.firstName + ' ') : '' + this.lastName ? this.lastName : '').trim();
    }
}
