using com.vorwardit.wordsworthcms.Engine;
using com.vorwardit.wordsworthcms.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using com.vorwardit.wordsworthcms.ViewModels;
using com.vorwardit.wordsworthcms.BusinessLogic.Interfaces;
using Microsoft.AspNet.Identity;

namespace com.vorwardit.wordsworthcms.API
{
    [Authorize]
    [RoutePrefix("api/site")]
    public class SiteController : ApiController
    {
        ISiteService siteService;
		IUserService userService;

		public SiteController(ISiteService siteService, IUserService userService)
        {
            this.siteService = siteService;
			this.userService = userService;
        }

        [HttpGet]
        public async Task<IHttpActionResult> Get()
        {
            var sites = await siteService.GetAllAsync();
            return Ok(sites.Select(s => Mapper.Map<SiteViewModel>(s)));
        }

        [HttpPost]
        public async Task<IHttpActionResult> Post(SiteViewModel model)
        {
			var allowed = await userService.HasPermission(User.Identity.GetUserId(), PermissionType.Admin, null);
			if (!allowed)
			{
				return BadRequest("User is not authorised to perform this action");
			}

			Site site = await siteService.GetOrCreateAsync(model.SiteId);
            site.Name = model.Name;
            site.Bindings = model.Bindings;
            await siteService.UpdateAsync(site);
            return Ok();
        }

        [HttpDelete]
        public async Task<IHttpActionResult> Delete(Guid id)
        {
			var allowed = await userService.HasPermission(User.Identity.GetUserId(), PermissionType.Admin, null);
			if (!allowed)
			{
				return BadRequest("User is not authorised to perform this action");
			}

			await siteService.DeleteAsync(id);
            return Ok();
        }
    }
}
