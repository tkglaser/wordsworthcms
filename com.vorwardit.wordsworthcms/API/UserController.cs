using com.vorwardit.wordsworthcms.BusinessLogic.Interfaces;
using com.vorwardit.wordsworthcms.Models;
using com.vorwardit.wordsworthcms.ViewModels;
using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace com.vorwardit.wordsworthcms.API
{
    [Authorize]
    [RoutePrefix("api/user")]
    public class UserController : ApiController
    {
        IUserService userService;
        ISiteService siteService;

        public UserController(IUserService userService, ISiteService siteService)
        {
            this.userService = userService;
            this.siteService = siteService;
        }

        public async Task<IHttpActionResult> Get()
        {
            var user = await userService.GetUserAsync(User.Identity.GetUserId());

            var model = new UserViewModel
            {
                UserId = user.Id,
                UserName = user.UserName,
                Type = user.Type,
                SiteId = user.SiteId,
                SiteName = "*"
            };

            if (model.SiteId.HasValue)
            {
                var site = await siteService.GetAsync(model.SiteId.Value);
                model.SiteName = site.Name;
            }

            return Ok(model);
        }

        [Route("all")]
        public async Task<IHttpActionResult> GetAll()
        {
			var allowed = await userService.HasPermission(User.Identity.GetUserId(), PermissionType.Admin, null);
            if (!allowed)
            {
                return BadRequest("User is not authorised to perform this action");
            }

            var users = await userService.GetUsersAsync();
            var sites = await siteService.GetAllAsync();

            var model = new List<UserViewModel>();
            foreach (var user in users)
            {
                var newUser = new UserViewModel
                {
                    UserId = user.Id,
                    UserName = user.UserName,
                    Type = user.Type,
                    SiteId = user.SiteId,
                    SiteName = "*"
                };

                if (newUser.SiteId.HasValue)
                {
                    newUser.SiteName = sites.FirstOrDefault(s => s.SiteId == newUser.SiteId.Value).Name;
                }

                model.Add(newUser);
            }

            return Ok(model);
        }

        public async Task<IHttpActionResult> Post(UserViewModel model)
        {
			var allowed = await userService.HasPermission(User.Identity.GetUserId(), PermissionType.Admin, null);
            if (!allowed)
            {
                return BadRequest("User is not authorised to perform this action");
            }

            await userService.UpdateAsync(model.UserId, model.Type, model.SiteId);

            return Ok();
        }

        [HttpPost]
        [Route("create")]
        public async Task<IHttpActionResult> PostCreate(CreateUserViewModel model)
        {
			var allowed = await userService.HasPermission(User.Identity.GetUserId(), PermissionType.Admin, null);
			if (!allowed)
            {
                return BadRequest("User is not authorised to perform this action");
            }

            await userService.CreateUser(model.UserName, model.Password, model.Type, model.SiteId);

            return Ok();
        }

        public async Task<IHttpActionResult> Delete(string id)
        {
			var allowed = await userService.HasPermission(User.Identity.GetUserId(), PermissionType.Admin, null);
			if (!allowed)
			{
				return BadRequest("User is not authorised to perform this action");
			}

			await userService.DeleteUser(id);
            return Ok();
        }
    }
}
