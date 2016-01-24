namespace com.vorwardit.wordsworthcms.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class MigEmbeddPermissions : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Permissions", "SiteId", "dbo.Sites");
            DropForeignKey("dbo.Permissions", "UserId", "dbo.AspNetUsers");
            DropIndex("dbo.Permissions", new[] { "UserId" });
            DropIndex("dbo.Permissions", new[] { "SiteId" });
            AddColumn("dbo.AspNetUsers", "Type", c => c.Int(nullable: false));
            AddColumn("dbo.AspNetUsers", "SiteId", c => c.Guid());
            CreateIndex("dbo.AspNetUsers", "SiteId");
            AddForeignKey("dbo.AspNetUsers", "SiteId", "dbo.Sites", "SiteId");
            DropTable("dbo.Permissions");
        }
        
        public override void Down()
        {
            CreateTable(
                "dbo.Permissions",
                c => new
                    {
                        PermissionId = c.Long(nullable: false, identity: true),
                        UserId = c.String(nullable: false, maxLength: 128),
                        Type = c.Int(nullable: false),
                        SiteId = c.Guid(),
                    })
                .PrimaryKey(t => t.PermissionId);
            
            DropForeignKey("dbo.AspNetUsers", "SiteId", "dbo.Sites");
            DropIndex("dbo.AspNetUsers", new[] { "SiteId" });
            DropColumn("dbo.AspNetUsers", "SiteId");
            DropColumn("dbo.AspNetUsers", "Type");
            CreateIndex("dbo.Permissions", "SiteId");
            CreateIndex("dbo.Permissions", "UserId");
            AddForeignKey("dbo.Permissions", "UserId", "dbo.AspNetUsers", "Id", cascadeDelete: true);
            AddForeignKey("dbo.Permissions", "SiteId", "dbo.Sites", "SiteId");
        }
    }
}
