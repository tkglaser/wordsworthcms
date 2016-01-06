namespace com.vorwardit.wordsworthcms.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Initial : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Layouts",
                c => new
                    {
                        LayoutId = c.Guid(nullable: false, defaultValueSql: "newid()"),
                        Name = c.String(maxLength: 50),
                        Body = c.String(),
                    })
                .PrimaryKey(t => t.LayoutId);
            
            CreateTable(
                "dbo.PageLayouts",
                c => new
                    {
                        PageLayoutId = c.Guid(nullable: false, defaultValueSql: "newid()"),
                        LayoutId = c.Guid(nullable: false),
                        Name = c.String(maxLength: 50),
                        Body = c.String(),
                    })
                .PrimaryKey(t => t.PageLayoutId)
                .ForeignKey("dbo.Layouts", t => t.LayoutId, cascadeDelete: false)
                .Index(t => t.LayoutId);
            
            CreateTable(
                "dbo.Pages",
                c => new
                    {
                        PageId = c.Guid(nullable: false, defaultValueSql: "newid()"),
                        SiteId = c.Guid(nullable: false),
                        PageLayoutId = c.Guid(nullable: false),
                        Name = c.String(maxLength: 50),
                    })
                .PrimaryKey(t => t.PageId)
                .ForeignKey("dbo.PageLayouts", t => t.PageLayoutId, cascadeDelete: false)
                .ForeignKey("dbo.Sites", t => t.SiteId, cascadeDelete: false)
                .Index(t => t.SiteId)
                .Index(t => t.PageLayoutId);
            
            CreateTable(
                "dbo.Sites",
                c => new
                    {
                        SiteId = c.Guid(nullable: false, defaultValueSql: "newid()"),
                        Name = c.String(maxLength: 50),
                        Bindings = c.String(),
                    })
                .PrimaryKey(t => t.SiteId);
            
            CreateTable(
                "dbo.PageUrls",
                c => new
                    {
                        PageUrlId = c.Long(nullable: false, identity: true),
                        PageId = c.Guid(nullable: false),
                        Url = c.String(maxLength: 1024),
                    })
                .PrimaryKey(t => t.PageUrlId)
                .ForeignKey("dbo.Pages", t => t.PageId, cascadeDelete: false)
                .Index(t => t.PageId);
            
            CreateTable(
                "dbo.AspNetRoles",
                c => new
                    {
                        Id = c.String(nullable: false, maxLength: 128),
                        Name = c.String(nullable: false, maxLength: 256),
                    })
                .PrimaryKey(t => t.Id)
                .Index(t => t.Name, unique: true, name: "RoleNameIndex");
            
            CreateTable(
                "dbo.AspNetUserRoles",
                c => new
                    {
                        UserId = c.String(nullable: false, maxLength: 128),
                        RoleId = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => new { t.UserId, t.RoleId })
                .ForeignKey("dbo.AspNetRoles", t => t.RoleId, cascadeDelete: true)
                .ForeignKey("dbo.AspNetUsers", t => t.UserId, cascadeDelete: true)
                .Index(t => t.UserId)
                .Index(t => t.RoleId);
            
            CreateTable(
                "dbo.AspNetUsers",
                c => new
                    {
                        Id = c.String(nullable: false, maxLength: 128),
                        Email = c.String(maxLength: 256),
                        EmailConfirmed = c.Boolean(nullable: false),
                        PasswordHash = c.String(),
                        SecurityStamp = c.String(),
                        PhoneNumber = c.String(),
                        PhoneNumberConfirmed = c.Boolean(nullable: false),
                        TwoFactorEnabled = c.Boolean(nullable: false),
                        LockoutEndDateUtc = c.DateTime(),
                        LockoutEnabled = c.Boolean(nullable: false),
                        AccessFailedCount = c.Int(nullable: false),
                        UserName = c.String(nullable: false, maxLength: 256),
                    })
                .PrimaryKey(t => t.Id)
                .Index(t => t.UserName, unique: true, name: "UserNameIndex");
            
            CreateTable(
                "dbo.AspNetUserClaims",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        UserId = c.String(nullable: false, maxLength: 128),
                        ClaimType = c.String(),
                        ClaimValue = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.UserId, cascadeDelete: true)
                .Index(t => t.UserId);
            
            CreateTable(
                "dbo.AspNetUserLogins",
                c => new
                    {
                        LoginProvider = c.String(nullable: false, maxLength: 128),
                        ProviderKey = c.String(nullable: false, maxLength: 128),
                        UserId = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => new { t.LoginProvider, t.ProviderKey, t.UserId })
                .ForeignKey("dbo.AspNetUsers", t => t.UserId, cascadeDelete: true)
                .Index(t => t.UserId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.AspNetUserRoles", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.AspNetUserLogins", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.AspNetUserClaims", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.AspNetUserRoles", "RoleId", "dbo.AspNetRoles");
            DropForeignKey("dbo.PageUrls", "PageId", "dbo.Pages");
            DropForeignKey("dbo.Pages", "SiteId", "dbo.Sites");
            DropForeignKey("dbo.Pages", "PageLayoutId", "dbo.PageLayouts");
            DropForeignKey("dbo.PageLayouts", "LayoutId", "dbo.Layouts");
            DropIndex("dbo.AspNetUserLogins", new[] { "UserId" });
            DropIndex("dbo.AspNetUserClaims", new[] { "UserId" });
            DropIndex("dbo.AspNetUsers", "UserNameIndex");
            DropIndex("dbo.AspNetUserRoles", new[] { "RoleId" });
            DropIndex("dbo.AspNetUserRoles", new[] { "UserId" });
            DropIndex("dbo.AspNetRoles", "RoleNameIndex");
            DropIndex("dbo.PageUrls", new[] { "PageId" });
            DropIndex("dbo.Pages", new[] { "PageLayoutId" });
            DropIndex("dbo.Pages", new[] { "SiteId" });
            DropIndex("dbo.PageLayouts", new[] { "LayoutId" });
            DropTable("dbo.AspNetUserLogins");
            DropTable("dbo.AspNetUserClaims");
            DropTable("dbo.AspNetUsers");
            DropTable("dbo.AspNetUserRoles");
            DropTable("dbo.AspNetRoles");
            DropTable("dbo.PageUrls");
            DropTable("dbo.Sites");
            DropTable("dbo.Pages");
            DropTable("dbo.PageLayouts");
            DropTable("dbo.Layouts");
        }
    }
}
