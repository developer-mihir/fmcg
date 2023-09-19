import {
    BaseEntity,
    Column,
    CreateDateColumn, DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column('varchar', {
        length: '15',
        nullable: true,
    })
    phone_number: string;

    @Column({ nullable: true, unique : true })
    email: string;

    @Column({ select: false })
    password: string;

    @Column({ nullable: true, default : 1 })
    status: number;

    @Column({ nullable: true, default : 2})
    role_id: number;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}
