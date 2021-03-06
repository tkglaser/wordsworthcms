﻿using System.Data.Entity;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System.ComponentModel.DataAnnotations.Schema;
using System;

namespace com.vorwardit.wordsworthcms.Models
{
    public enum PermissionType
    {
        Admin = 0,
        Designer = 1,
        ContentEditor = 2
    }

    // You can add profile data for the user by adding more properties to your ApplicationUser class, please visit http://go.microsoft.com/fwlink/?LinkID=317594 to learn more.
    public class ApplicationUser : IdentityUser
    {
        public async Task<ClaimsIdentity> GenerateUserIdentityAsync(UserManager<ApplicationUser> manager)
        {
            // Note the authenticationType must match the one defined in CookieAuthenticationOptions.AuthenticationType
            var userIdentity = await manager.CreateIdentityAsync(this, DefaultAuthenticationTypes.ApplicationCookie);
            // Add custom user claims here
            return userIdentity;
        }

        public PermissionType Type { get; set; }

        [ForeignKey("Site")]
        public Guid? SiteId { get; set; }
        public Site Site { get; set; }
    }

    [DbConfigurationType(typeof(DataContextConfiguration))]
	public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext()
            : base("DefaultConnection", throwIfV1Schema: false)
        {
        }

        public static ApplicationDbContext Create()
        {
            return new ApplicationDbContext();
        }

        public DbSet<Site> Sites { get; set; }
        public DbSet<Layout> Layouts { get; set; }
        public DbSet<PageLayout> PageLayouts { get; set; }
        public DbSet<Page> Pages { get; set; }
        public DbSet<PageUrl> PageUrls { get; set; }
        public DbSet<PageVersion> PageVersions { get; set; }
        public DbSet<Content> Contents { get; set; }
    }
}