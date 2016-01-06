using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace com.vorwardit.wordsworthcms.Modules.Core
{
    public interface IModule
    {
		ActionResult Index(Guid pageVersionId, string position);

		ActionResult Edit(Guid pageVersionId, string position);

		ActionResult Save(Guid pageVersionId, string position, NameValueCollection form);
	}
}