using API.Helper;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [Route("api/[controller]")] // localhost:5001/api/Members
    [ApiController]
    public class BaseController : ControllerBase
    {
    }
}
