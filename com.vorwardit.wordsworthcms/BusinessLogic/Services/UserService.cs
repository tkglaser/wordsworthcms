using com.vorwardit.wordsworthcms.BusinessLogic.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using com.vorwardit.wordsworthcms.Models;
using System.Threading.Tasks;
using System.Data.Entity;

namespace com.vorwardit.wordsworthcms.BusinessLogic.Services
{
    public class UserService : IUserService
    {
        private ApplicationDbContext db;
        private ApplicationUserManager userManager;

        public UserService(ApplicationDbContext db)
        {
            this.db = db;
            this.userManager = new ApplicationUserManager(new Microsoft.AspNet.Identity.EntityFramework.UserStore<ApplicationUser>(db));
        }

        public async Task<ApplicationUser> GetUserAsync(string userId)
        {
            return await db.Users.FirstOrDefaultAsync(u => u.Id == userId);
        }

        public async Task<IList<ApplicationUser>> GetUsersAsync()
        {
            return await db.Users.ToListAsync();
        }

        public async Task UpdateAsync(string userId, PermissionType type, Guid? siteId)
        {
            var dbUser = await db.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (dbUser == null)
            {
                return;
            }

            dbUser.Type = type;
            dbUser.SiteId = siteId;

            await db.SaveChangesAsync();
        }

        public async Task CreateUser(string userName, string password, PermissionType type, Guid? siteId)
        {
            var user = new ApplicationUser
            {
                UserName = userName,
                Email = userName,
                Type = type,
                SiteId = siteId
            };
            var result = await userManager.CreateAsync(user, password);
            if (result.Succeeded)
            {
                // TODO
            }
        }

        public async Task DeleteUser(string userId)
        {
            var user = await db.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user != null)
            {
                await userManager.DeleteAsync(user);
            }
        }
    }
}