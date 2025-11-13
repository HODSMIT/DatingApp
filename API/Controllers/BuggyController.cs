using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class BuggyController : BaseController
{
    [HttpGet("auth")]

    public IActionResult GetAuth()
    {
        return Unauthorized();
    }


    [HttpGet("not-found")]

    public IActionResult GetNotFound()
    {
        return NotFound();
    }

    [HttpGet("server-error")]

    public IActionResult GetServerError()
    {
        throw new Exception("This is Server error");
    }

    [HttpGet("bad-request")]

    public IActionResult GetBadRequest()
    {
        throw new Exception("This was not a good request");
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("admin-secret")]
    public ActionResult<string> GetSecretAdmin()
    {
        return Ok("Only admins should see this");
    }
}
