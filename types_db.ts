export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string
                    created_at: string
                    email: string
                }
                Insert: {
                    id: string
                    created_at?: string
                    email: string
                }
                Update: {
                    id?: string
                    created_at?: string
                    email?: string
                }
                Relationships: []
            }
            profiles: {
                Row: {
                    id: string
                    created_at: string
                    username: string
                    full_name: string
                    avatar_url: string
                    bio: string
                    verified: boolean
                    followers: number
                    following: number
                }
                Insert: {
                    id: string
                    created_at?: string
                    username: string
                    full_name: string
                    avatar_url?: string
                    bio?: string
                    verified?: boolean
                    followers?: number
                    following?: number
                }
                Update: {
                    id?: string
                    created_at?: string
                    username?: string
                    full_name?: string
                    avatar_url?: string
                    bio?: string
                    verified?: boolean
                    followers?: number
                    following?: number
                }
                Relationships: [
                    {
                        foreignKeyName: "Profiles_id_fkey"
                        columns: ["id"]
                        isOneToOne: true
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            posts: {
                Row: {
                    id: string
                    created_at: string
                    user_id: string
                    content: string
                    likes: number
                    comment_count: number
                }
                Insert: {
                    id: string
                    created_at?: string
                    user_id: string
                    content: string
                    likes?: number
                    comment_count?: number
                }
                Update: {
                    id?: string
                    created_at?: string
                    user_id?: string
                    content?: string
                    likes?: number
                    comment_count?: number
                }
                Relationships: [
                    {
                        foreignKeyName: "Posts_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    }
                ]
            }
            likes: {
                Row: {
                    id: number
                    created_at: string
                    user_id: string
                    post_id: string
                }
                Insert: {
                    id?: number
                    created_at?: string
                    user_id: string
                    post_id: string
                }
                Update: {
                    id?: number
                    created_at?: string
                    user_id?: string
                    post_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "Likes_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "Likes_post_id_fkey"
                        columns: ["post_id"]
                        isOneToOne: false
                        referencedRelation: "posts"
                        referencedColumns: ["id"]
                    }
                ]
            }
            followers: {
                Row: {
                    id: number
                    created_at: string
                    user_id: string
                    follower_id: string
                }
                Insert: {
                    id?: number
                    created_at?: string
                    user_id: string
                    follower_id: string
                }
                Update: {
                    id?: number
                    created_at?: string
                    user_id?: string
                    follower_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "Followers_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "Followers_follower_id_fkey"
                        columns: ["follower_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    }
                ]
            }
            comments: {
                Row: {
                    id: string
                    created_at: string
                    user_id: string
                    post_id: string
                    content: string
                    likes: number
                }
                Insert: {
                    id: string
                    created_at?: string
                    user_id: string
                    post_id: string
                    content: string
                    likes?: number
                }
                Update: {
                    id?: string
                    created_at?: string
                    user_id?: string
                    post_id?: string
                    content?: string
                    likes?: number
                }
                Relationships: [
                    {
                        foreignKeyName: "Comments_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "Comments_post_id_fkey"
                        columns: ["post_id"]
                        isOneToOne: false
                        referencedRelation: "posts"
                        referencedColumns: ["id"]
                    }
                ]
            }
            notifications: {
                Row: {
                    id: string
                    created_at: string
                    user_id: string
                    type: string
                    read_status: string
                    related_id: string
                    creator_id: string
                }
                Insert: {
                    id?: string
                    created_at?: string
                    user_id: string
                    type: string
                    read_status?: string
                    related_id: string
                    creator_id: string
                }
                Update: {
                    id?: string
                    created_at?: string
                    user_id?: string
                    type?: string
                    read_status?: string
                    related_id?: string
                    creator_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "Notif_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    }
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}


export type Tables<
	PublicTableNameOrOptions extends
		| keyof (Database["public"]["Tables"] & Database["public"]["Views"])
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
			Database[PublicTableNameOrOptions["schema"]]["Views"])
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
		Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
			Row: infer R
		}
		? R
		: never
	: PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
		Database["public"]["Views"])
	? (Database["public"]["Tables"] &
		Database["public"]["Views"])[PublicTableNameOrOptions] extends {
			Row: infer R
		}
		? R
		: never
	: never

export type TablesInsert<
	PublicTableNameOrOptions extends
		| keyof Database["public"]["Tables"]
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  	? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    	Insert: infer I
    }
    ? I
    : never
	: PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
	? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
		Insert: infer I
	}
	? I
	: never
	: never

export type TablesUpdate<
	PublicTableNameOrOptions extends
		| keyof Database["public"]["Tables"]
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
		Update: infer U
    }
    ? U
    : never
	: PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
	? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
		Update: infer U
    }
    ? U
    : never
  	: never

export type Enums<
	PublicEnumNameOrOptions extends
		| keyof Database["public"]["Enums"]
		| { schema: keyof Database },
	EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
		: never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
	? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
	: PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
	? Database["public"]["Enums"][PublicEnumNameOrOptions]
	: never
