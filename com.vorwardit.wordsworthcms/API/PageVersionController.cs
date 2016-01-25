using com.vorwardit.wordsworthcms.BusinessLogic.Interfaces;
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

namespace com.vorwardit.wordsworthcms.API
{
    [Authorize]
    [RoutePrefix("api/pageversion")]
    public class PageVersionController : ApiController
    {
        IPageService pageService;
		IUserService userService;

		public PageVersionController(IPageService pageService, IUserService userService)
        {
            this.pageService = pageService;
			this.userService = userService;
        }

        [HttpGet]
        public async Task<IHttpActionResult> Get(Guid pageId)
        {
            return Ok(await pageService.GetPageVersionsByPageIdAsync(pageId));
        }

        [HttpPost]
        [Route("newversion")]
        public async Task<IHttpActionResult> PostNewVersion(Guid pageId)
        {
            await pageService.CreateNewVersionAsync(pageId);
            return Ok();
        }

        [HttpPost]
        [Route("publish")]
        public async Task<IHttpActionResult> Post(Guid versionId)
        {
            await pageService.Publish(versionId);
            return Ok();
        }

        [HttpPost]
        public async Task<IHttpActionResult> Post(PageVersion model)
        {
            await pageService.UpdateLatestVersionAsync(model);
            return Ok();
        }
    }
}
