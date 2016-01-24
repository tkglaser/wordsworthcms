using com.vorwardit.wordsworthcms.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace com.vorwardit.wordsworthcms.BusinessLogic.Interfaces
{
    public interface IUserService
    {
        Task<ApplicationUser> GetUserAsync(string userId);
        Task<IList<ApplicationUser>> GetUsersAsync();

        Task CreateUser(string userName, string password, PermissionType type, Guid? siteId);
        Task UpdateAsync(string userId, PermissionType type, Guid? siteId);
        Task DeleteUser(string userId);
    }
}
